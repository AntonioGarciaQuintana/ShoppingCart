import { Injectable, EventEmitter, Output } from '@angular/core';
import { DetailSale } from '../../model/detai-sale';
import { Product } from '../../model/product';

@Injectable()
export class ShoppingCarServive {
   productList: DetailSale[] = [];
   @Output() addtoCarEmmiter = new EventEmitter<any>();
   @Output() toBuyEmmiter = new EventEmitter<any>();
   @Output() tologinEmmiter = new EventEmitter<any>();
   @Output() tologoutEmmiter = new EventEmitter<any>();
   constructor() {

   }

   update() {
      this.addtoCarEmmiter.emit(null);
   }

   tobuy() {
      this.toBuyEmmiter.emit(null);
   }

   toLogin() {
      this.tologinEmmiter.emit(null);
   }
   toLogout() {
      this.initShoppingCart();
      this.tologoutEmmiter.emit(null);
   }

   initShoppingCart() {
      this.productList = [];
   }

   addToCar(product: Product, numersProducts: number) {
      const detailSale = new DetailSale();
      const newProduct = new Product();
      newProduct.id = product.id;
      detailSale.product = newProduct;
      detailSale.numberProducts = numersProducts;
      if (localStorage.getItem('shoppingCar') == null) {
         this.productList.push(detailSale);
         localStorage.setItem('shoppingCar', JSON.stringify(this.productList));
      } else {
         const ret = this.productList.find(detailSaleList => {
            return detailSaleList.product.id === product.id;
         });

         this.productList = this.getDetailSale();

         if (ret !== undefined && ret !== null) {
            this.sumProducts(product, numersProducts);
         } else {
            this.productList.push(detailSale);
         }
         localStorage.setItem('shoppingCar', JSON.stringify(this.productList));
      }
      this.addtoCarEmmiter.emit(null);
   }

   sumProducts(product: Product, numersProducts: number) {
      this.productList.map(detailSale => {
         if (detailSale.product.id === product.id) {
            detailSale.numberProducts += numersProducts;
         }
      });
   }


   coutElements() {
      let sumElements = 0;
      if (localStorage.getItem('shoppingCar') !== null && localStorage.getItem('shoppingCar') !== '') {
         this.productList = this.getDetailSale();
         this.productList.map(detailSale => {
            sumElements += detailSale.numberProducts;
         });
         return sumElements;
      } else {
         return sumElements;
      }
   }

   haveProducts() {
      let ret = false;
      this.productList = this.getDetailSale();
      if (localStorage.getItem('shoppingCar') !== null && localStorage.getItem('shoppingCar') !== '' && this.productList.length > 0) {
         ret = true;
      }
      return ret;
   }

   deleteShoppingCart() {
      localStorage.removeItem('shoppingCar');
      this.update();
   }

   getDetailSale() {
      return JSON.parse(localStorage.getItem('shoppingCar'));
   }

   getIdsProducts() {
      let ret = '';
      this.productList = this.getDetailSale();
      const idsProduct = [];
      this.productList.map(detailSale => {
         idsProduct.push(detailSale.product.id);
      });
      ret = idsProduct.join(',');

      return ret;
   }

   updateNumberProduct(idProduct: number, numbersProduct: number) {
      this.productList = this.getDetailSale();
      this.productList.map(elemet => {
         if (elemet.product.id === idProduct) {
            elemet.numberProducts = numbersProduct;
         }
      });
      localStorage.setItem('shoppingCar', JSON.stringify(this.productList));
      this.update();
   }

   removeProductShoppingCart(product: Product) {
      this.productList = this.getDetailSale();

      for (let i = 0; i < this.productList.length; i++) {
         if (this.productList[i].product.id === product.id) {
            this.productList.splice(i, 1);
         }
      }
      localStorage.setItem('shoppingCar', JSON.stringify(this.productList));
      this.update();
   }

}
