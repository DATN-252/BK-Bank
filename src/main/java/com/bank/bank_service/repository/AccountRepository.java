package com.bank.bank_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.bank_service.entity.Account;

public interface AccountRepository extends JpaRepository<Account, String> {

}
