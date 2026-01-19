package com.bank.bank_service.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bank.bank_service.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, String> {

    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);

    Page<Transaction> findByStatus(Transaction.Status status, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.card.cardId = :cardId")
    Page<Transaction> findByCardId(@Param("cardId") String cardId, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.merchant.merchantId = :merchantId")
    Page<Transaction> findByMerchantId(@Param("merchantId") String merchantId, Pageable pageable);

    Page<Transaction> findByFraudDecision(Transaction.FraudDecision fraudDecision, Pageable pageable);

    Page<Transaction> findByChannel(Transaction.Channel channel, Pageable pageable);

    long countByFraudDecision(Transaction.FraudDecision fraudDecision);

    @Query("SELECT t FROM Transaction t WHERE t.card.cardId = :cardId AND t.status = :status")
    Page<Transaction> findByCardIdAndStatus(@Param("cardId") String cardId, @Param("status") Transaction.Status status,
            Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.merchant.merchantId = :merchantId AND t.status = :status")
    Page<Transaction> findByMerchantIdAndStatus(@Param("merchantId") String merchantId,
            @Param("status") Transaction.Status status, Pageable pageable);

    // Find high-risk transactions
    @Query("SELECT t FROM Transaction t WHERE t.riskScore >= :minRiskScore ORDER BY t.riskScore DESC")
    Page<Transaction> findHighRiskTransactions(@Param("minRiskScore") Double minRiskScore, Pageable pageable);
}
