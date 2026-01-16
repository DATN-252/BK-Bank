package com.bank.bank_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.bank_service.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, String> {

}
