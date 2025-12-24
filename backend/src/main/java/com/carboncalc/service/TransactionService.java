package com.carboncalc.service;

import com.carboncalc.entity.MarketplaceItem;
import com.carboncalc.entity.Transaction;
import com.carboncalc.entity.User;
import com.carboncalc.repository.TransactionRepository;
import com.carboncalc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MarketplaceService marketplaceService;

    @Transactional
    public Transaction createTransaction(Long userId, Long itemId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MarketplaceItem item = marketplaceService.getItemById(itemId);

        if (!item.getIsActive() || item.getStock() < quantity) {
            throw new RuntimeException("Item not available or insufficient stock");
        }

        Double totalPrice = item.getPrice() * quantity;

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setItem(item);
        transaction.setQuantity(quantity);
        transaction.setTotalPrice(totalPrice);
        transaction.setStatus("COMPLETED");

        marketplaceService.updateStock(itemId, quantity);

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
