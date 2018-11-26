import { FormControl } from '@angular/forms';
import { AuthService } from './../../commons/services/auth.service';
import { DetailSale } from './../../model/detai-sale';
import { Sale } from './../../model/sale';
import { ApiService } from './../../commons/services/api-service.service';
import { OnInit, Component } from '@angular/core';
import { Product } from '../../model/product';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NotifyService } from '../../commons/services/notify.service';
import { Router } from '@angular/router';
import { ShoppingCarServive } from '../../commons/services/shopping-car.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    selector: 'app-detail-shopping',
    // styleUrls: ['./product-management.component.css'],
    templateUrl: './detail-shopping.component.html'
})
export class DetailShoppingComponent implements OnInit {

    productToBuy: Sale;
    urlProductController = '/product';
    modalRef: NgbModalRef;
    urlSaleController = '/sale';
    numersProducrtsControl: FormControl = new FormControl('');

    constructor(
        private apiService: ApiService
        , private router: Router
        , private modalService: NgbModal
        , private notify: NotifyService
        , private shopping: ShoppingCarServive
        , private authService: AuthService
        , private spinnerService: Ng4LoadingSpinnerService
    ) {
    }
    ngOnInit(): void {
        this.getProductsByIds();
    }

    getProductsByIds() {
        if (this.shopping.haveProducts()) {
            const idsProducts = this.shopping.getIdsProducts();
            this.apiService.getElement(this.urlProductController + '/getProductsByIds', idsProducts)
                .subscribe(
                    result => {
                        this.generateShoppingCar(result);
                    },
                    error => {
                        console.log(error);
                    }
                );

        } else {
            this.productToBuy = new Sale();
            this.shopping.deleteShoppingCart();
        }
    }

    generateShoppingCar(pruducts: Product[]) {
        this.productToBuy = new Sale();
        this.productToBuy.detailSale = [];
        this.productToBuy.user = this.authService.getUserLogged();
        const shoppingCart = this.shopping.getDetailSale();
        pruducts.forEach(prod => {
            const detailsale = new DetailSale();
            detailsale.product = prod;
            const ret = shoppingCart.find(detailSaleList => {
                return detailSaleList.product.id === prod.id;
            });
            detailsale.numberProducts = ret.numberProducts;
            detailsale.unitCost = prod.price;
            detailsale.subTotal = detailsale.product.price * detailsale.numberProducts;
            this.productToBuy.detailSale.push(detailsale);
        });
        let sum = 0;
        this.productToBuy.detailSale.forEach(detail => {
            sum += detail.subTotal;
        });
        this.productToBuy.total = sum;

    }

    openConfirmationModal(content) {
        if (this.authService.isLogged()) {
            this.modalRef = this.modalService.open(content);
            this.modalRef.result.then((result) => {
                console.log(`Closed with: ${result}`);
            }, (reason) => {
                console.log(`Dismissed ${this.getDismissReason(reason)}`);
            });
        } else {
            this.notify.info('You need start the session to buy');
            this.router.navigate(['/login']);
        }
    }

    private getDismissReason(reason: any): string {

        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    closeModal() {
        this.modalRef.close();
    }

    OnBuy() {
        this.spinnerService.show();
        this.apiService.addElement(this.urlSaleController + '/saveSale', this.productToBuy)
            .subscribe(
                result => {
                    this.notify.success('The Sale saved correctly');
                    localStorage.removeItem('shoppingCar');
                    this.router.navigate(['/home']);
                    this.shopping.tobuy();
                    this.closeModal();
                    this.spinnerService.hide();
                },
                error => {
                    this.spinnerService.hide();
                    console.error(error);
                    this.notify.error('An error has occurred in save the sale');
                }
            );
    }


    deleteProductOfCar(product: Product) {
        this.shopping.removeProductShoppingCart(product);
        this.getProductsByIds();
        this.notify.success('The product was removed from the shpopping cart correctly');
    }

    deleteAll() {
        localStorage.removeItem('shoppingCar');
    }

    onRest(detailSale: DetailSale) {
        if (detailSale.numberProducts > 1) {
            this.shopping.updateNumberProduct(detailSale.product.id, --detailSale.numberProducts);
            this.recalculePrice();
        }
    }
    onSum(detailSale: DetailSale) {
        if (detailSale.numberProducts < 999) {
            this.shopping.updateNumberProduct(detailSale.product.id, ++detailSale.numberProducts);
            this.recalculePrice();
        }
    }

    onChangeNumberProducts(numbers: number, product: Product) {
        if ((+numbers > 0)) {
            this.shopping.updateNumberProduct(product.id, +numbers);
            this.recalculePrice();
        }
    }

    recalculePrice() {
        this.productToBuy.detailSale.map(detailSale => {
            detailSale.subTotal = detailSale.product.price * detailSale.numberProducts;
        });
        let sum = 0;
        this.productToBuy.detailSale.forEach(detail => {
            sum += detail.subTotal;
        });
        this.productToBuy.total = sum;

    }

}
