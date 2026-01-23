package com.bank.bank_service.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.bank.bank_service.dto.request.CardPaymentRequest;
import com.bank.bank_service.entity.Card;
import com.bank.bank_service.entity.Merchant;
import com.bank.bank_service.entity.Transaction;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FraudService {

    @Data
    @Builder
    public static class FraudResult {
        private Transaction.FraudDecision decision;
        private Double riskScore;
        private String reasonCode;
    }

    public FraudResult checkTransaction(Card card, Merchant merchant, BigDecimal amount) {
        log.info("Checking fraud for transaction - Card: {}, Amount: {}", card.getCardId(), amount);

        if (card.getStatus() != Card.Status.ACTIVE) {
             return FraudResult.builder()
                .decision(Transaction.FraudDecision.REJECT)
                .riskScore(0.9)
                .reasonCode("CARD_BLOCKED")
                .build();
        }

        if (amount.compareTo(new BigDecimal("50000000")) > 0) {
            log.warn("High value transaction detected: {}", amount);
            return FraudResult.builder()
                .decision(Transaction.FraudDecision.REVIEW)
                .riskScore(0.6)
                .reasonCode("HIGH_VALUE_TRANSACTION")
                .build();
        }

        if (amount.remainder(new BigDecimal("1000")).compareTo(new BigDecimal("999")) == 0) {
             return FraudResult.builder()
                .decision(Transaction.FraudDecision.REVIEW)
                .riskScore(0.5)
                .reasonCode("SUSPICIOUS_AMOUNT_PATTERN")
                .build();
        }

        return FraudResult.builder()
            .decision(Transaction.FraudDecision.PASS)
            .riskScore(0.1)
            .reasonCode("NORMAL")
            .build();
    }
}
