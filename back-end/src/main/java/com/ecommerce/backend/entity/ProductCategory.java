package com.ecommerce.backend.entity;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.*;

@Entity
@Table (name="product_category")
@Getter
@Setter

public class ProductCategory {

    @Id
    private Long id;

    @Column(name = "category_name")
    private String categoryName;

    @OneToMany(cascade = CascadeType.ALL, mappedBy ="category")
    private Set<Product> products;

}
