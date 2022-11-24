import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;


  constructor() {

    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if(data!=null){
      this.cartItems=data;

      this.computeCartTotals();
    }

  }

  addToCart(theCartItem : CartItem){

    //verifier si on deja l'item dans le panier

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0){
      // trouver l'item

      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      alreadyExistsInCart = (existingCartItem != undefined);

    }
    // verifier si on la trouver

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPriceValue: number =0;
    let totalQuantityValue:number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unit_price * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;

    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart
    this.logCartData(totalQuantityValue,totalPriceValue);

    this.persistCartItems();
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  private logCartData(totalQuantityValue: number, totalPriceValue: number) {
    console.log('Content of the cart');
    for (let tempcartItem of this.cartItems) {
      const subTotalPrice = tempcartItem.quantity * tempcartItem.quantity;
      console.log(`name=${tempcartItem.name}, quantity=${tempcartItem.quantity}, unitPrice=${tempcartItem.unit_price}, subTotalPrice=${subTotalPrice}`)
    }
    console.log(`Total Price : ${totalPriceValue.toFixed(2)}, totalQuantity : ${totalQuantityValue}`)
    console.log('------')
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity == 0){
      this.remove(theCartItem);
    }
    this.computeCartTotals();
  }

  remove(theCartItem: CartItem) {

    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    if (itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();

    }
  }
}
