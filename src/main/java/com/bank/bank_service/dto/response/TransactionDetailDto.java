package com.bank.bank_service.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionDetailDto {
    private String transactionId;
    private String channel;
    private String status;
    private BigDecimal amount;
    private LocalDate transDate;
    private OffsetDateTime transTime;
    private Long unixTime;
    private String transNum;

    // Card info
    private String cardLast4;
    private String cardType;

    // Merchant info
    private String merchantId;
    private String merchantName;
    private String merchantCategory;
    private String merchantCity;
    private Double merchantLat;
    private Double merchantLong;

    // Fraud Detection
    private Double riskScore;
    private String fraudDecision;
    private String modelVersion;
    private String reasonCode;

    private OffsetDateTime createdAt;
}
