package com.bank.bank_service.entity;

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
@Table(name = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Card {
    @Id
    @Column(name = "card_id", length = 36)
    String cardId;

    @Column(name = "pan_token", nullable = false, unique = true, length = 128)
    String panToken;

    @Column(nullable = false, length = 4)
    String last4;

    @Column(name = "exp_month", nullable = false)
    Integer expMonth;

    @Column(name = "exp_year", nullable = false)
    Integer expYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Status status;

    @Column(name = "card_type", length = 40)
    String cardType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    Account account;

    @Column(name = "created_at", insertable = false, updatable = false)
    OffsetDateTime createdAt;

    public enum Status {
        ACTIVE, BLOCKED
    }
}
