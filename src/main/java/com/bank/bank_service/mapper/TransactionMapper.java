package com.bank.bank_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bank.bank_service.dto.response.CardPaymentResponse;
import com.bank.bank_service.dto.response.TransactionDetailResponse;
import com.bank.bank_service.entity.Transaction;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(source = "transactionId", target = "transactionId")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "amount", target = "amount")
    @Mapping(source = "merchant.merchantName", target = "merchantName")
    @Mapping(source = "merchant.category", target = "merchantCategory")
    @Mapping(source = "transTime", target = "transactionTime")
    @Mapping(source = "riskScore", target = "riskScore")
    CardPaymentResponse toCardPaymentResponse(Transaction transaction);

    @Mapping(source = "transactionId", target = "transactionId")
    @Mapping(source = "channel", target = "channel")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "amount", target = "amount")
    @Mapping(source = "transDate", target = "transDate")
    @Mapping(source = "transTime", target = "transTime")
    @Mapping(source = "unixTime", target = "unixTime")
    @Mapping(source = "transNum", target = "transNum")
    @Mapping(source = "card.last4", target = "cardLast4")
    @Mapping(source = "card.cardType", target = "cardType")
    @Mapping(source = "merchant.merchantId", target = "merchantId")
    @Mapping(source = "merchant.merchantName", target = "merchantName")
    @Mapping(source = "merchant.category", target = "merchantCategory")
    @Mapping(source = "merchant.city", target = "merchantCity")
    @Mapping(source = "merchant.merchLat", target = "merchantLat")
    @Mapping(source = "merchant.merchLong", target = "merchantLong")
    @Mapping(source = "riskScore", target = "riskScore")
    @Mapping(source = "fraudDecision", target = "fraudDecision")
    @Mapping(source = "modelVersion", target = "modelVersion")
    @Mapping(source = "reasonCode", target = "reasonCode")
    @Mapping(source = "createdAt", target = "createdAt")
    TransactionDetailResponse toTransactionDetailResponse(Transaction transaction);
}