package com.bank.bank_service.dto.request;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CardPaymentRequest {
    private String cardId;
    private String merchantId;
    private BigDecimal amount;
    private String description;
    private String idempotencyKey;
}
