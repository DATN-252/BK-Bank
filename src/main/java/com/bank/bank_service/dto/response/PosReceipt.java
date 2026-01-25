package com.bank.bank_service.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PosReceipt {
    private String merchantId;
    private String merchantName;
    private String terminalId;
    private String cardIdHidden;
    private BigDecimal amount;
    private String transactionDate;
    private String authCode;
    private String responseCode;
    private String message;
}
