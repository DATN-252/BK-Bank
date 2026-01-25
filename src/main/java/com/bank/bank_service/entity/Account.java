package com.bank.bank_service.entity;

import java.math.BigDecimal;
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
@Data
@Table(name = "accounts")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Account {
    @Id
    @Column(name = "account_number", length = 32)
    String accountNumber;

    @Column(nullable = false, precision = 18, scale = 2)
    BigDecimal balance;

    @Column(name = "hold_balance", nullable = false, precision = 18, scale = 2)
    BigDecimal holdBalance;

    @Column(name = "credit_limit", precision = 18, scale = 2)
    BigDecimal creditLimit;

    @Column(nullable = false, length = 3)
    String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Status status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Column(name = "created_at", insertable = false, updatable = false)
    OffsetDateTime createdAt;

    public enum Status {
        ACTIVE, BLOCKED
    }
}
