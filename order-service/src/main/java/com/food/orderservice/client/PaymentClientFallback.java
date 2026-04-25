package com.food.order.client;

import com.food.order.dto.PaymentRequest;
import com.food.order.dto.PaymentResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PaymentClientFallback implements PaymentClient {

    @Override
    public PaymentResponse processPayment(PaymentRequest request) {
        log.error("Payment service unavailable — fallback triggered for order: {}", request.getOrderId());
        return new PaymentResponse(null, request.getOrderId(), "FAILED",
                "Payment service is currently unavailable. Please try again.");
    }
}