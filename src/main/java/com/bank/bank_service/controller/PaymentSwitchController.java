package com.bank.bank_service.controller;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bank.bank_service.dto.request.CardPaymentRequest;
import com.bank.bank_service.dto.response.ApiResponse;
import com.bank.bank_service.dto.response.CardPaymentResponse;
import com.bank.bank_service.service.TransactionService;
import com.solab.iso8583.IsoMessage;
import com.solab.iso8583.IsoType;
import com.solab.iso8583.MessageFactory;
import com.solab.iso8583.parse.ConfigParser;

import com.bank.bank_service.exception.AppException;
import com.bank.bank_service.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/switch")
@RequiredArgsConstructor
@Slf4j
public class PaymentSwitchController {

    private final TransactionService transactionService;
    private static final MessageFactory<IsoMessage> mf = new MessageFactory<>();

    static {
        // Define standard fields for parsing if not using a config file
        // For simplicity, we assume standard ASCII packing in this demo
        mf.setUseBinaryMessages(false);
        mf.setAssignDate(true);
    }

    /**
     * Handle ISO 8583 Message (Simulated over HTTP)
     * Input: Hex String or Raw String of ISO message
     */
    @PostMapping("/iso8583")
    public ResponseEntity<ApiResponse<String>> handleIsoMessage(@RequestBody String isoString) {
        log.info("Switch received ISO message: {}", isoString);

        // 1. Parse ISO Message Sim
        String[] parts = isoString.split(",");
        if (parts.length < 4) {
             return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .code(9999)
                    .message("Invalid ISO format simulation. Expected: MTI,PAN,AMOUNT,MERCHANT")
                    .build());
        }
        
        String pan = parts[1];
        String amountStr = parts[2];
        String merchantId = parts[3];

        try {
            // 2. Map to Internal DTO
            BigDecimal amount = new BigDecimal(amountStr);
            
            CardPaymentRequest request = CardPaymentRequest.builder()
                    .cardId(pan) 
                    .merchantId(merchantId)
                    .amount(amount)
                    .idempotencyKey("ISO-" + System.currentTimeMillis())
                    .description("ISO 8583 Transaction")
                    .build();

            // 3. Process via Auth Service (TransactionService)
            CardPaymentResponse response = transactionService.processCardPayment(request);

            // 4. Pack Response (0110)
            String responseCode = "00"; // Success
            String isoResponse = String.format("0110,%s,%s,%s,%s,%s", pan, amountStr, merchantId, responseCode, response.getTransactionId());

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .code(1000)
                    .message("Switch processed successfully")
                    .result(isoResponse)
                    .build());

        } catch (AppException e) {
            log.warn("Transaction Declined: {}", e.getErrorCode());
            String responseCode = "05"; 
            if (e.getErrorCode() == ErrorCode.INSUFFICIENT_FUNDS) {
                responseCode = "51";
            }
            
            // Reconstruct ISO Response for Decline using available variables
            String isoResponse = String.format("0110,%s,%s,%s,%s,NONE", pan, amountStr, merchantId, responseCode);
            
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .code(1000)
                    .message("Switch processed (Declined)")
                    .result(isoResponse)
                    .build());
        } catch (Exception e) {
            log.error("Error processing ISO message", e);
             return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .code(9999)
                    .message("Switch Error: " + e.getMessage())
                    .build());
        }
    }
}
