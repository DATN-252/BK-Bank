package com.bank.bank_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.bank_service.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, String> {

}
