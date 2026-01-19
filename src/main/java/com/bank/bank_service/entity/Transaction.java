package com.bank.bank_service.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "transactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Transaction {
    @Id
    @Column(name = "transaction_id", length = 36)
    String transactionId;

    @Column(name = "idempotency_key", nullable = false, unique = true, length = 80)
    String idempotencyKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Channel channel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(name = "trans_date")
    private LocalDate transDate;

    @Column(name = "trans_time", nullable = false)
    private OffsetDateTime transTime;

    @Column(name = "unix_time")
    private Long unixTime;

    @Column(name = "trans_num", length = 64)
    private String transNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id")
    private Merchant merchant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id")
    private Card card;

    @Column(name = "risk_score")
    private Double riskScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "fraud_decision")
    private FraudDecision fraudDecision;

    @Column(name = "model_version", length = 40)
    private String modelVersion;

    @Column(name = "reason_code", length = 80)
    private String reasonCode;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public enum Channel {
        CARD_PAYMENT, TRANSFER
    }

    public enum Status {
        PENDING, APPROVED, DECLINED, SUCCESS, FAILED, REFUNDED
    }

    public enum FraudDecision {
        PASS, REJECT, REVIEW
    }

}
