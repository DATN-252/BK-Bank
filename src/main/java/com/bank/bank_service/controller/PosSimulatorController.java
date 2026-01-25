package com.bank.bank_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.bank.bank_service.dto.request.CardPaymentRequest;
import com.bank.bank_service.dto.response.ApiResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/pos")
@RequiredArgsConstructor
@Slf4j
public class PosSimulatorController {

    private final PaymentSwitchController paymentSwitchController;
    private final com.bank.bank_service.repository.MerchantRepositoy merchantRepository;

    /**
     * Simulate Swiping Card at POS
     * Input: JSON (CardID, Amount, Merchant)
     * Output: "Receipt" (Success/Fail)
     */
    @PostMapping("/swipe")
    public ResponseEntity<ApiResponse<com.bank.bank_service.dto.response.PosReceipt>> swipeCard(@RequestBody CardPaymentRequest request) {
        log.info("POS: Card Swiped! Generating ISO 8583 Message...");

        // Construct ISO 8583 Message (Format: MTI,PAN,AMOUNT,MERCHANT)
        // MTI 0100: Authorization Request
        String mti = "0100";
        String pan = request.getCardId();
        String amount = request.getAmount().toString();
        String merchant = request.getMerchantId();

        String isoMessage = String.format("%s,%s,%s,%s", mti, pan, amount, merchant);
        log.info("POS: Sending ISO Message to Switch: {}", isoMessage);

        // Send to Switch 
        ResponseEntity<ApiResponse<String>> switchResponse = paymentSwitchController.handleIsoMessage(isoMessage);

        if (switchResponse.getStatusCode().is2xxSuccessful() && switchResponse.getBody() != null) {
            String isoResponse = switchResponse.getBody().getResult();
            log.info("POS: Received ISO Response: {}", isoResponse);
            
            String[] parts = isoResponse.split(",");
            // Format: 0110,PAN,AMOUNT,MERCHANT,CODE,TXN_ID
            String responseCode = parts[4];
            String txnId = parts.length > 5 ? parts[5] : "NONE";
            
           
            String merchantName = "UNKNOWN MERCHANT";
            try {
                merchantName = merchantRepository.findById(merchant)
                        .map(com.bank.bank_service.entity.Merchant::getMerchantName)
                        .orElse("UNKNOWN STORE");
            } catch (Exception e) {
                log.warn("Failed to fetch merchant name: {}", e.getMessage());
            }

            
            com.bank.bank_service.dto.response.PosReceipt receipt = com.bank.bank_service.dto.response.PosReceipt.builder()
                    .merchantId(merchant)
                    .merchantName(merchantName) 
                    .terminalId("POS-9999")
                    .cardIdHidden(maskCard(pan))
                    .amount(request.getAmount())
                    .transactionDate(java.time.LocalDateTime.now().toString())
                    .authCode(txnId) 
                    .responseCode(responseCode)
                    .message("00".equals(responseCode) ? "APPROVED" : "DECLINED")
                    .build();

            if ("00".equals(responseCode)) {
                 return ResponseEntity.ok(ApiResponse.<com.bank.bank_service.dto.response.PosReceipt>builder()
                        .code(1000)
                        .message("TRANSACTION APPROVED")
                        .result(receipt)
                        .build());
            } else {
                 return ResponseEntity.badRequest().body(ApiResponse.<com.bank.bank_service.dto.response.PosReceipt>builder()
                        .code(9999)
                        .message("TRANSACTION DECLINED")
                        .result(receipt) 
                        .build());
            }
        }

        return ResponseEntity.internalServerError().body(ApiResponse.<com.bank.bank_service.dto.response.PosReceipt>builder()
                .message("Communication Error")
                .build());
    }

    private String maskCard(String cardId) {
        if (cardId == null || cardId.length() < 4) return "****";
        return "****-****-****-" + cardId.substring(cardId.length() - 4);
    }
}
