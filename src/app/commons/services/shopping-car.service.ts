import { Product } from './../../model/product';
import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable()
export class ShoppingCarServive {
   productList: Product[] = [];
   @Output() addtoCarEmmiter = new EventEmitter<any>();
   @Output() toBuyEmmiter = new EventEmitter<any>();
   @Output() tologinEmmiter = new EventEmitter<any>();
   @Output() tologoutEmmiter = new EventEmitter<any>();
   constructor() {

   }

   addCar() {
      this.addtoCarEmmiter.emit(null);
   }

   tobuy() {
      this.toBuyEmmiter.emit(null);
   }

   toLogin() {
      this.tologinEmmiter.emit(null);
   }
   toLogout() {
      this.tologoutEmmiter.emit(null);
   }

}
