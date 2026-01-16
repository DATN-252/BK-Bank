package com.bank.bank_service.repository;

import java.beans.Customizer;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customizer, String> {

}
