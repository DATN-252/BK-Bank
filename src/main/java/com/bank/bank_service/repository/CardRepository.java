package com.bank.bank_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.bank_service.entity.Card;

public interface CardRepository extends JpaRepository<Card, String> {

}
