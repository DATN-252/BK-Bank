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

    /**
     * Simulate Swiping Card at POS
     * Input: JSON (CardID, Amount, Merchant)
     * Output: "Receipt" (Success/Fail)
     */
    @PostMapping("/swipe")
    public ResponseEntity<ApiResponse<String>> swipeCard(@RequestBody CardPaymentRequest request) {
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
            String responseCode = parts[4];
            
            if ("00".equals(responseCode)) {
                 return ResponseEntity.ok(ApiResponse.<String>builder()
                        .code(1000)
                        .message("TRANSACTION APPROVED")
                        .result("Receipt: " + parts[5])
                        .build());
            } else {
                 return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                        .code(9999)
                        .message("TRANSACTION DECLINED: " + responseCode)
                        .build());
            }
        }

        return ResponseEntity.internalServerError().body(ApiResponse.<String>builder()
                .message("Communication Error")
                .build());
    }
}
