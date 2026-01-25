package com.bank.bank_service.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.bank_service.dto.request.CardPaymentRequest;
import com.bank.bank_service.dto.response.CardPaymentResponse;
import com.bank.bank_service.dto.response.TransactionDetailResponse;
import com.bank.bank_service.entity.Card;
import com.bank.bank_service.entity.Merchant;
import com.bank.bank_service.entity.Transaction;
import com.bank.bank_service.exception.AppException;
import com.bank.bank_service.exception.ErrorCode;
import com.bank.bank_service.mapper.TransactionMapper;
import com.bank.bank_service.repository.CardRepository;
import com.bank.bank_service.repository.MerchantRepositoy;
import com.bank.bank_service.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final CardRepository cardRepository;
    private final MerchantRepositoy merchantRepositoy;
    private final LedgerService ledgerService;
    private final FraudService fraudService;
    private final TransactionMapper transactionMapper;

    @Transactional
    public CardPaymentResponse processCardPayment(CardPaymentRequest request) {
        log.info("Processing card payment - Card: {}, Merchant: {}, Amount: {}", request.getCardId(),
                request.getMerchantId(), request.getAmount());
        validatePaymentRequest(request);
        checkDuplicateTransaction(request.getIdempotencyKey());

        Card card = getCardOrThrow(request.getCardId());
        Merchant merchant = getMerchantOrThrow(request.getMerchantId());

        // 1. Perform Fraud Check
        FraudService.FraudResult fraudResult = fraudService.checkTransaction(card, merchant, request.getAmount());
        if (fraudResult.getDecision() == Transaction.FraudDecision.REJECT) {
            log.warn("Transaction rejected by FDS - Card: {}, Reason: {}", card.getCardId(), fraudResult.getReasonCode());
            
            // Save rejected transaction for audit
            Transaction transaction = createTransaction(card, merchant, request, fraudResult);
            transaction.setStatus(Transaction.Status.DECLINED);
            transactionRepository.save(transaction);
            
            throw new AppException(ErrorCode.TRANSACTION_FAILED); 
        }

        // 2. Authorize Payment (Hold Funds)
        ledgerService.holdFunds(card, request.getAmount());

        // 3. Create Transaction record (Status: APPROVED/AUTHORIZED)
        Transaction transaction = createTransaction(card, merchant, request, fraudResult);
        transaction.setStatus(Transaction.Status.APPROVED); 
        transactionRepository.save(transaction);

        log.info("Card payment authorized successfully - Transaction ID: {}", transaction.getTransactionId());
        return transactionMapper.toCardPaymentResponse(transaction);
    }

    /**
     * Settle transactions (Clear & Settlement)
     * Moves money from Hold to Actual Deduction
     */
    @Transactional
    public void settleTransactions() {
        log.info("Starting settlement process...");
        Page<Transaction> authorizedOps = transactionRepository.findByStatus(Transaction.Status.APPROVED, Pageable.unpaged());
        
        for (Transaction tx : authorizedOps.getContent()) {
            try {
                log.info("Settling transaction: {}", tx.getTransactionId());
                
                ledgerService.captureFunds(tx.getCard(), tx.getAmount());
                
                tx.setStatus(Transaction.Status.SUCCESS);
                transactionRepository.save(tx);
                
            } catch (Exception e) {
                log.error("Failed to settle transaction: {}", tx.getTransactionId(), e);
            }
        }
        log.info("Settlement process completed.");
    }

    // GET transaction by ID
    public TransactionDetailResponse getTransactionById(String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_FAILED));
        return transactionMapper.toTransactionDetailResponse(transaction);
    }

    // Get Transaction by status
    public Page<TransactionDetailResponse> getTransactionByStatus(String status, Pageable pageable) {
        Transaction.Status statusEnum = Transaction.Status.valueOf(status);
        return transactionRepository.findByStatus(statusEnum, pageable)
                .map(transactionMapper::toTransactionDetailResponse);
    }

    // Get transaction by card ID
    public Page<TransactionDetailResponse> getTransactionByCard(String cardId, Pageable pageable) {
        return transactionRepository.findByCardId(cardId, pageable).map(transactionMapper::toTransactionDetailResponse);
    }

    // Get Transaction by merhchant ID
    public Page<TransactionDetailResponse> getTransactionByMerchant(String merchantId, Pageable pageable) {
        return transactionRepository.findByMerchantId(merchantId, pageable)
                .map(transactionMapper::toTransactionDetailResponse);
    }

    // get all fraudulent transactions
    public Page<TransactionDetailResponse> getFraudulentTransactions(Pageable pageable) {
        return transactionRepository.findByFraudDecision(Transaction.FraudDecision.REJECT, pageable)
                .map(transactionMapper::toTransactionDetailResponse);
    }

    // Get transactions under review
    public Page<TransactionDetailResponse> getTransactionsUnderReview(Pageable pageable) {
        return transactionRepository.findByFraudDecision(Transaction.FraudDecision.REVIEW, pageable)
                .map(transactionMapper::toTransactionDetailResponse);
    }

    private void validatePaymentRequest(CardPaymentRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_AMOUNT);
        }
        if (request.getCardId() == null || request.getCardId().trim().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_CARD);
        }
        if (request.getMerchantId() == null || request.getMerchantId().trim().isEmpty()) {
            throw new AppException(ErrorCode.MERCHANT_NOT_FOUND);
        }
    }

    private void checkDuplicateTransaction(String idempotencyKey) {
        if (idempotencyKey != null && !idempotencyKey.trim().isEmpty()) {
            Optional<Transaction> existing = transactionRepository.findByIdempotencyKey(idempotencyKey);
            if (existing.isPresent()) {
                throw new AppException(ErrorCode.DUPLICATE_TRANSACTION);
            }
        }
    }

    private Card getCardOrThrow(String cardId) {
        return cardRepository.findById(cardId).orElseThrow(() -> new AppException(ErrorCode.INVALID_CARD));
    }

    private Merchant getMerchantOrThrow(String merchantId) {
        return merchantRepositoy.findById(merchantId).orElseThrow(() -> new AppException(ErrorCode.MERCHANT_NOT_FOUND));
    }

    private Transaction createTransaction(Card card, Merchant merchant, CardPaymentRequest request, FraudService.FraudResult fraudResult) {
        String transactionId = UUID.randomUUID().toString();
        long unix_time = Instant.now().getEpochSecond();
        OffsetDateTime transTime = OffsetDateTime.now(ZoneOffset.UTC);
        LocalDate transDate = LocalDate.now();

        return Transaction.builder()
                .transactionId(transactionId)
                .idempotencyKey(request.getIdempotencyKey())
                .channel(Transaction.Channel.CARD_PAYMENT)
                // Status set by caller
                .amount(request.getAmount())
                .transDate(transDate)
                .transTime(transTime)
                .unixTime(unix_time)
                .transNum(generateTransNum())
                .card(card)
                .merchant(merchant)
                .fraudDecision(fraudResult.getDecision())
                .riskScore(fraudResult.getRiskScore())
                .reasonCode(fraudResult.getReasonCode())
                .build();
    }

    private String generateTransNum() {
        return "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String getRiskLevel(Double riskScore) {
        if (riskScore == null || riskScore < 0.3) {
            return "SAFE";
        } else if (riskScore < 0.7) {
            return "REVIEW";
        } else {
            return "FRAUD";
        }
    }
}
