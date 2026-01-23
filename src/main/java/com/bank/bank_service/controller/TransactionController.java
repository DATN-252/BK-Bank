package com.bank.bank_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bank.bank_service.dto.request.CardPaymentRequest;
import com.bank.bank_service.dto.response.ApiResponse;
import com.bank.bank_service.dto.response.CardPaymentResponse;
import com.bank.bank_service.dto.response.TransactionDetailResponse;
import com.bank.bank_service.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {
    private final TransactionService transactionService;

    /**
     * POST /api/transactions/card-payment
     * Process card payment transaction
     */
    @PostMapping("/card-payment")
    public ResponseEntity<ApiResponse<CardPaymentResponse>> processCardPayment(
            @Valid @RequestBody CardPaymentRequest request) {
        log.info("Received card payment request - Card: {}, Merchant: {}, Amount: {}",
                request.getCardId(), request.getMerchantId(), request.getAmount());
        CardPaymentResponse response = transactionService.processCardPayment(request);
        ApiResponse<CardPaymentResponse> apiResponse = ApiResponse.<CardPaymentResponse>builder()
                .code(1000)
                .message("Payment processed successfully")
                .result(response)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    /**
     * POST /api/transactions/settle
     * Trigger daily settlement 
     */
    @PostMapping("/settle")
    public ResponseEntity<ApiResponse<String>> settleTransactions() {
        log.info("Received settlement request");
        transactionService.settleTransactions();
        
        ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                .code(1000)
                .message("Settlement process completed successfully")
                .result("Settled all APPROVED transactions")
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * GET /api/transactions/{transactionId}
     * Get transaction details by ID
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<ApiResponse<TransactionDetailResponse>> getTransactionById(
            @PathVariable String transactionId) {
        log.info("Fetching transaction - ID: {}", transactionId);

        TransactionDetailResponse response = transactionService.getTransactionById(transactionId);

        ApiResponse<TransactionDetailResponse> apiResponse = ApiResponse.<TransactionDetailResponse>builder().code(1000)
                .message("Transaction retrived successfully").result(response).build();
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * GET /api/transactions?status=SUCCESS&page=0&size=10
     * Get transactions by status with pagination
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransactionDetailResponse>>> getTransactionbyStatus(
            @RequestParam(defaultValue = "SUCCESS") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching transactions - Status: {}, Page: {}, Size: {}", status, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionDetailResponse> response = transactionService.getTransactionByStatus(status, pageable);

        ApiResponse<Page<TransactionDetailResponse>> apirResponse = ApiResponse
                .<Page<TransactionDetailResponse>>builder().code(1000).message("Transaction retrieved successfully")
                .result(response).build();
        return ResponseEntity.ok(apirResponse);
    }

    /**
     * GET /api/transactions/card/{cardId}?page=0&size=10
     * Get transactions by card ID
     */
    @GetMapping("/card/{cardId}")
    public ResponseEntity<ApiResponse<Page<TransactionDetailResponse>>> getTransactionsByCard(
            @PathVariable String cardId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching transactions by card - Card ID: {}, Page: {}, Size: {}", cardId, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionDetailResponse> response = transactionService.getTransactionByCard(cardId, pageable);

        ApiResponse<Page<TransactionDetailResponse>> apiResponse = ApiResponse
                .<Page<TransactionDetailResponse>>builder()
                .code(1000)
                .message("Transactions retrieved successfully")
                .result(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    /**
     * GET /api/transactions/merchant/{merchantId}?page=0&size=10
     * Get transactions by merchant ID
     */
    @GetMapping("/merchant/{merchantId}")
    public ResponseEntity<ApiResponse<Page<TransactionDetailResponse>>> getTransactionsByMerchant(
            @PathVariable String merchantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching transactions by merchant - Merchant ID: {}, Page: {}, Size: {}", merchantId, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionDetailResponse> response = transactionService.getTransactionByMerchant(merchantId, pageable);

        ApiResponse<Page<TransactionDetailResponse>> apiResponse = ApiResponse
                .<Page<TransactionDetailResponse>>builder()
                .code(1000)
                .message("Transactions retrieved successfully")
                .result(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    /**
     * GET /api/transactions/fraud/fraudulent?page=0&size=10
     * Get all fraudulent transactions (fraud_decision = REJECT)
     */
    @GetMapping("/fraud/fraudulent")
    public ResponseEntity<ApiResponse<Page<TransactionDetailResponse>>> getFraudulentTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching fraudulent transactions - Page: {}, Size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionDetailResponse> response = transactionService.getFraudulentTransactions(pageable);

        ApiResponse<Page<TransactionDetailResponse>> apiResponse = ApiResponse
                .<Page<TransactionDetailResponse>>builder()
                .code(1000)
                .message("Fraudulent transactions retrieved successfully")
                .result(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    /**
     * GET /api/transactions/fraud/review?page=0&size=10
     * Get transactions under review (fraud_decision = REVIEW)
     */
    @GetMapping("/fraud/review")
    public ResponseEntity<ApiResponse<Page<TransactionDetailResponse>>> getTransactionsUnderReview(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching transactions under review - Page: {}, Size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionDetailResponse> response = transactionService.getTransactionsUnderReview(pageable);

        ApiResponse<Page<TransactionDetailResponse>> apiResponse = ApiResponse
                .<Page<TransactionDetailResponse>>builder()
                .code(1000)
                .message("Transactions under review retrieved successfully")
                .result(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
