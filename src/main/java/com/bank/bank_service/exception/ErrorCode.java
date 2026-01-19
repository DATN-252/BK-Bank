package com.bank.bank_service.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Unauthorized exception"),
    INVALID_KEY(1001, "Invalid message key"),

    INVALID_CARD(2001, "Card not found or invalid"),
    CARD_BLOCKED(2002, "Card is blocked"),
    CARD_EXPIRED(2003, "Card has expired"),
    INSUFFICIENT_FUNDS(2004, "Insufficient funds in account"),
    MERCHANT_NOT_FOUND(2005, "Merchant not found"),
    TRANSACTION_FAILED(2006, "Transaction failed"),
    DUPLICATE_TRANSACTION(2007, "Duplicate transaction detected"),
    INVALID_AMOUNT(2008, "Invalid transaction amount"),
    ACCOUNT_NOT_FOUND(2009, "Account not found"),
    ACCOUNT_BLOCKED(2010, "Account is blocked");

    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return this.code;
    }

    public String getMessage() {
        return this.message;
    }
}
