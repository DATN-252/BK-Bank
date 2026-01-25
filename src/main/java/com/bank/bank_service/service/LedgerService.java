package com.bank.bank_service.service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.ZoneOffset;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.bank_service.entity.Account;
import com.bank.bank_service.entity.Card;
import com.bank.bank_service.exception.AppException;
import com.bank.bank_service.exception.ErrorCode;
import com.bank.bank_service.repository.AccountRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LedgerService {
    private final AccountRepository accountRepository;

    
    @Transactional
    public void holdFunds(Card card, BigDecimal amount) {
        log.info("Ledger: Holding funds - Card: {}, Amount: {}", card.getCardId(), amount);

        validateCardStatus(card);
        validateCardExpiration(card);

        Account account = card.getAccount();
        validateAccountStatus(account);

        // Lock account to prevent race condition
        Account lockedAccount = accountRepository.findByAccountNumberWithLock(account.getAccountNumber())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Check for Credit Limit (Credit Card) vs Balance (Debit Card)
        BigDecimal availableBalance;
        if (lockedAccount.getCreditLimit() != null && lockedAccount.getCreditLimit().compareTo(BigDecimal.ZERO) > 0) {
            // CREDIT CARD: Available = (Balance + CreditLimit) - Hold
            availableBalance = lockedAccount.getBalance()
                    .add(lockedAccount.getCreditLimit())
                    .subtract(lockedAccount.getHoldBalance());
        } else {
            // DEBIT CARD: Available = Balance - Hold
            availableBalance = lockedAccount.getBalance().subtract(lockedAccount.getHoldBalance());
        }

        if (availableBalance.compareTo(amount) < 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_FUNDS);
        }

        // Increase HOLD balance
        lockedAccount.setHoldBalance(lockedAccount.getHoldBalance().add(amount));
        accountRepository.save(lockedAccount);

        log.info("Ledger: Funds held successfully - Account: {}, Held Amount: {}", lockedAccount.getAccountNumber(), amount);
    }

    /**
     * Capture funds (Settlement)
     * Deducts from real balance and releases hold.
     */
    @Transactional
    public void captureFunds(Card card, BigDecimal amount) {
        log.info("Ledger: Capturing funds - Card: {}, Amount: {}", card.getCardId(), amount);

        Account account = card.getAccount();
        Account lockedAccount = accountRepository.findByAccountNumberWithLock(account.getAccountNumber())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // 1. Reduce Real Balance
        lockedAccount.setBalance(lockedAccount.getBalance().subtract(amount));
        
        // 2. Reduce Hold Balance
        BigDecimal newHold = lockedAccount.getHoldBalance().subtract(amount);
        if (newHold.compareTo(BigDecimal.ZERO) < 0) {
             log.warn("Ledger: Hold balance negative after capture! Account: {}", account.getAccountNumber());
             newHold = BigDecimal.ZERO;
        }
        lockedAccount.setHoldBalance(newHold);

        accountRepository.save(lockedAccount);
        log.info("Ledger: Funds captured successfully - Account: {}", lockedAccount.getAccountNumber());
    }

    /**
     * Refund / Release Hold
     */
    @Transactional
    public void releaseHold(Card card, BigDecimal amount) {
        log.info("Ledger: Releasing hold - Card: {}, Amount: {}", card.getCardId(), amount);

        Account account = card.getAccount();
        Account lockedAccount = accountRepository.findByAccountNumberWithLock(account.getAccountNumber())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Decrease Hold Balance
        BigDecimal newHold = lockedAccount.getHoldBalance().subtract(amount);
        if (newHold.compareTo(BigDecimal.ZERO) < 0) {
             newHold = BigDecimal.ZERO;
        }
        lockedAccount.setHoldBalance(newHold);
        
        accountRepository.save(lockedAccount);

        log.info("Ledger: Hold released successfully - Account: {}", lockedAccount.getAccountNumber());
    }

    private void validateCardStatus(Card card) {
        if (card.getStatus() != Card.Status.ACTIVE) {
            throw new AppException(ErrorCode.CARD_BLOCKED);
        }
    }

    private void validateCardExpiration(Card card) {
        YearMonth now = YearMonth.now(ZoneOffset.UTC);
        YearMonth cardExpiry = YearMonth.of(card.getExpYear(), card.getExpMonth());

        if (cardExpiry.isBefore(now)) {
            throw new AppException(ErrorCode.CARD_EXPIRED);
        }
    }

    private void validateAccountStatus(Account account) {
        if (account == null) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        if (account.getStatus() != Account.Status.ACTIVE) {
            throw new AppException(ErrorCode.ACCOUNT_BLOCKED);
        }
    }
}
