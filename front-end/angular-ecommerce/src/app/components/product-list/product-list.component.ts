import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];
  searchMode : boolean = false;
  currentCategoryId: number = 1;

  constructor(private productService : ProductService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
        this.listProducts();
      }
    )
  }

  listProducts() {
    //verifie si on est en train de chercher ou pas
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      console.log("search mode")
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

  }

  handleListProducts(){

    //verifie si l'id de la categorie de product existe
    const hasCategory: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategory) {
      //convertir en int l'id pour l'exploiter
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      //pas de category... par défaut sera la categorie 1
      this.currentCategoryId = 1;
    }
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )

  }

  private handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // recherche des produits qui utilise se mot

    this.productService.searchProducts(theKeyword).subscribe(
      data=>{
        this.products=data;
      }
    )
  }
}
