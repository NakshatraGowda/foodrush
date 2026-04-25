package com.food.order.service;

import com.food.order.client.PaymentClient;
import com.food.order.dto.*;
import com.food.order.entity.Order;
import com.food.order.entity.OrderItem;
import com.food.order.entity.OrderStatus;
import com.food.order.exception.ResourceNotFoundException;
import com.food.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentClient paymentClient;

    @Transactional
    public OrderDTO createOrder(CreateOrderRequest request) {
        log.info("Creating order for customer: {}", request.getCustomerEmail());

        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .deliveryAddress(request.getDeliveryAddress())
                .status(OrderStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .build();

        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            BigDecimal subtotal = itemReq.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            return OrderItem.builder()
                    .order(order)
                    .menuItemId(itemReq.getMenuItemId())
                    .itemName(itemReq.getItemName())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(items);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        log.info("Order created with id: {}", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public OrderDTO processPayment(Long orderId, String paymentMethod) {
        log.info("Processing payment for order: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Order " + orderId + " is not in PENDING status");
        }

        PaymentRequest paymentRequest = PaymentRequest.builder()
                .orderId(orderId)
                .amount(order.getTotalAmount())
                .paymentMethod(paymentMethod)
                .customerEmail(order.getCustomerEmail())
                .build();

        PaymentResponse response = paymentClient.processPayment(paymentRequest);
        log.info("Payment response for order {}: {}", orderId, response.getStatus());

        if ("SUCCESS".equalsIgnoreCase(response.getStatus())) {
            order.setStatus(OrderStatus.CONFIRMED);
            log.info("Order {} confirmed after successful payment", orderId);
        } else {
            order.setStatus(OrderStatus.PAYMENT_FAILED);
            log.warn("Order {} payment failed: {}", orderId, response.getMessage());
        }

        return toDTO(orderRepository.save(order));
    }

    public OrderDTO getOrderById(Long id) {
        return toDTO(orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id)));
    }

    public List<OrderDTO> getOrdersByEmail(String email) {
        log.info("Fetching orders for email: {}", email);
        return orderRepository.findByCustomerEmail(email)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setStatus(status);
        log.info("Updated order {} status to {}", id, status);
        return toDTO(orderRepository.save(order));
    }

    private OrderDTO toDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .menuItemId(item.getMenuItemId())
                        .itemName(item.getItemName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .customerPhone(order.getCustomerPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(itemDTOs)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}