import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];
  searchMode : boolean = false;
  currentCategoryId : number = 1;
  previousCategory: number = 1;

  // Page proprities
  thePageNumber : number = 1;
  thePageSize : number = 5;
  theTotalElements : number =0 ;

  previousKeyword : string = "";

  constructor(private productService : ProductService,
              private cartService : CartService,
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

    // Si on a un id different que le precedent, on met la page à 1
    if(this.previousCategory != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategory = this.currentCategoryId;

    console.log(`currentCateoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`)

    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult())

  }

  private handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // si le mot est different que l'ancien, on remet la page a 1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;

    console.log(`The Keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`)

    // recherche des products qui utilise se mot

    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                                this.thePageSize,
                                                theKeyword).subscribe(this.processResult())
  }

  updatePageSize(pageSize: string) {

    this.thePageSize= +pageSize;
    this.thePageNumber = 1;
    this.listProducts();

  }

  private processResult() {
    return (data : any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(tempProduct: Product) {
    console.log(`Adding to cart: ${tempProduct.name}, ${tempProduct.unit_price}`)

    const theCartItem = new CartItem(tempProduct);

    this.cartService.addToCart(theCartItem);
  }
}
