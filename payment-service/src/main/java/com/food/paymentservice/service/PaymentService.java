package com.food.payment.service;

import com.food.payment.dto.PaymentDTO;
import com.food.payment.dto.PaymentRequest;
import com.food.payment.entity.Payment;
import com.food.payment.entity.PaymentStatus;
import com.food.payment.exception.ResourceNotFoundException;
import com.food.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Transactional
    public PaymentDTO processPayment(PaymentRequest request) {
        log.info("Processing payment for order: {} amount: {}", request.getOrderId(), request.getAmount());

        // Check for duplicate payment
        if (paymentRepository.findByOrderId(request.getOrderId()).isPresent()) {
            throw new IllegalStateException("Payment already processed for order: " + request.getOrderId());
        }

        // Simulate payment processing (90% success rate)
        boolean success = Math.random() > 0.1;

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .customerEmail(request.getCustomerEmail())
                .status(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED)
                .transactionId(success ? "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() : null)
                .failureReason(success ? null : "Simulated payment failure")
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Payment {} for order {}: status={}", saved.getId(), request.getOrderId(), saved.getStatus());
        return toDTO(saved);
    }

    public PaymentDTO getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));
        return toDTO(payment);
    }

    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return toDTO(payment);
    }

    public List<PaymentDTO> getPaymentsByEmail(String email) {
        return paymentRepository.findByCustomerEmail(email)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private PaymentDTO toDTO(Payment p) {
        return PaymentDTO.builder()
                .id(p.getId())
                .orderId(p.getOrderId())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod())
                .customerEmail(p.getCustomerEmail())
                .status(p.getStatus())
                .transactionId(p.getTransactionId())
                .failureReason(p.getFailureReason())
                .createdAt(p.getCreatedAt())
                .build();
    }
}