package com.bank.bank_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.bank_service.entity.Merchant;

public interface MerchantRepositoy extends JpaRepository<Merchant, String> {

}
