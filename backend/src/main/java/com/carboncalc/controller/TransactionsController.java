package com.carboncalc.controller;

import com.carboncalc.entity.Transaction;
import com.carboncalc.entity.User;
import com.carboncalc.repository.UserRepository;
import com.carboncalc.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionsController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestBody Map<String, Object> request,
            Principal principal) {

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long itemId = Long.valueOf(request.get("itemId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());

        Transaction transaction = transactionService.createTransaction(user.getId(), itemId, quantity);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getUserTransactions(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(transactionService.getUserTransactions(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }
}
