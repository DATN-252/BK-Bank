package com.bank.bank_service.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CardPaymentResponse {
    private String transactionId;
    private String status;
    private BigDecimal amount;
    private String merchantName;
    private String merchantCategory;
    private OffsetDateTime transactionTime;
    private String riskLevel; // SAFE, REVIEW, FRAUD
    private Double riskScore;
    private String message;
}
