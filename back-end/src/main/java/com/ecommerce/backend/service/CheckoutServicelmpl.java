package com.ecommerce.backend.service;

import com.ecommerce.backend.dao.CustomerRepository;
import com.ecommerce.backend.dto.Purchase;
import com.ecommerce.backend.dto.PurchaseResponse;
import com.ecommerce.backend.entity.Customer;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServicelmpl implements CheckoutService{

    private CustomerRepository customerRepository;

    public CheckoutServicelmpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        //populate all data

        Order order = purchase.getOrder();
        
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItems();

        orderItems.forEach(item -> order.add(item));

        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer =purchase.getCustomer();
        customer.add(order);

        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {

        // generate random UUID number (UUID version-4

        return UUID.randomUUID().toString();
    }
}
