package com.bank.bank_service.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "customers")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Customer {
    @Id
    @Column(name = "citizen_id", length = 32)
    String citizenId;
    @Column(name = "first_name", nullable = false, length = 80)
    String firstName;

    @Column(name = "last_name", nullable = false, length = 80)
    String lastName;

    @Column(length = 30)
    String phone;

    @Column(name = "date_of_birth")
    LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    Gender gender;

    @Column(length = 120)
    String job;

    @Column(name = "home_country", nullable = false, length = 2)
    String homeCountry;

    @Column(precision = 10, scale = 7)
    BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    BigDecimal longitude;

    @Column(name = "created_at", insertable = false, updatable = false)
    OffsetDateTime createdAt;

    public enum Gender {
        M, F, O
    }
}
