package com.bank.bank_service.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "merchant")
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Merchant {
    @Id
    @Column(name = "merchant_id", length = 64)
    String merchantId;

    @Column(name = "merchant_name", nullable = false, length = 160)
    String merchantName;

    @Column(nullable = false, length = 60)
    String category;

    @Column(nullable = false, length = 2)
    String country;

    @Column(name = "city_population")
    Integer cityPopulation;

    @Column(length = 120)
    String city;

    @Column(length = 160)
    String street;

    @Column(length = 60)
    String state;

    @Column(length = 20)
    String zip;

    @Column(name = "merch_long", precision = 10, scale = 7)
    BigDecimal merchLong;

    @Column(name = "merch_lat", precision = 10, scale = 7)
    BigDecimal merchLat;

    @Column(name = "created_at", insertable = false, updatable = false)
    OffsetDateTime createdAt;
}
