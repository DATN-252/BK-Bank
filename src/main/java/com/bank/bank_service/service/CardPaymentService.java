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
public class CardPaymentService {
    private final AccountRepository accountRepository;

    @Transactional
    public void validateAndProcessPayment(Card card, BigDecimal amount) {
        log.info("Validating and processing payment - Card: {}, Amount: {}", card.getCardId(), amount);

        validateCardStatus(card);

        validateCardExpiration(card);

        Account account = card.getAccount();
        validateAccountStatus(account);

        // Lock account để tránh double-spend
        Account lockedAccount = accountRepository.findByAccountNumberWithLock(account.getAccountNumber())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        checkSufficientFunds(lockedAccount, amount);

        lockedAccount.setBalance(lockedAccount.getBalance().subtract(amount));
        accountRepository.save(lockedAccount);

        log.info("Payment processed successfully - Account: {}, Amount: {}", lockedAccount.getAccountNumber(), amount);
    }

    /**
     * Refund payment to account
     */
    @Transactional
    public void refundPayment(Card card, BigDecimal amount) {
        log.info("Refunding payment - Card: {}, Amount: {}", card.getCardId(), amount);

        Account account = card.getAccount();
        validateAccountStatus(account);

        Account lockedAccount = accountRepository.findByAccountNumberWithLock(account.getAccountNumber())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        lockedAccount.setBalance(lockedAccount.getBalance().add(amount));
        accountRepository.save(lockedAccount);

        log.info("Payment refunded successfully - Account: {}, Amount: {}", lockedAccount.getAccountNumber(), amount);
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

    private void checkSufficientFunds(Account account, BigDecimal amount) {
        if (account.getBalance().compareTo(amount) < 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_FUNDS);
        }
    }
}