package com.bank.bank_service.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bank.bank_service.entity.Account;

import jakarta.persistence.LockModeType;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    /**
     * Find account by accountNumber with PESSIMISTIC_WRITE lock
     * Để tránh race condition khi debit/credit
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.accountNumber = :accountNumber")
    Optional<Account> findByAccountNumberWithLock(@Param("accountNumber") String accountNumber);

    /**
     * Find account by accountNumber (without lock)
     */
    Optional<Account> findByAccountNumber(String accountNumber);

    /**
     * Find all accounts of a customer
     */
    @Query("SELECT a FROM Account a WHERE a.customer.citizenId = :customerId")
    Page<Account> findByCustomerId(@Param("customerId") String customerId, Pageable pageable);

    /**
     * Find all accounts by status
     */
    Page<Account> findByStatus(Account.Status status, Pageable pageable);

    /**
     * Find all accounts by branch
     */
    @Query("SELECT a FROM Account a WHERE a.branch.branchId = :branchId")
    Page<Account> findByBranchId(@Param("branchId") Long branchId, Pageable pageable);

    /**
     * Count active accounts
     */
    long countByStatus(Account.Status status);

    // Find accounts with balance greater than amount
    @Query("SELECT a FROM Account a WHERE a.balance >= :minBalance")
    Page<Account> findAccountsByMinBalance(@Param("minBalance") java.math.BigDecimal minBalance, Pageable pageable);
}