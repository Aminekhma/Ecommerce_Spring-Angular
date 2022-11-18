package com.ecommerce.backend.entity;


import lombok.Data;

import javax.persistence.*;
import java.util.*;

@Entity
@Table (name="product_category")
@Data
public class ProductCategory {

    @Id
    private Long id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy ="category")
    private Set<Product> products;

}
