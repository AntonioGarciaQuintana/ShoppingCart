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

    constructor(
        private apiService: ApiService
        , private router: Router
        , private modalService: NgbModal
        , private notify: NotifyService
        , private shopping: ShoppingCarServive
        , private authService: AuthService) {
    }
    ngOnInit(): void {
        this.getProductsByIds();
    }

    getProductsByIds() {
        if (localStorage.getItem('shoppingCar') !== null) {
            const idsProducts = localStorage.getItem('shoppingCar');
            this.apiService.getElement(this.urlProductController + '/getProductsByIds', idsProducts)
                .subscribe(
                    result => {
                        this.generateShoppingCar(result);
                    },
                    error => {
                        console.log(error);
                    }
                );

        }
    }

    generateShoppingCar(pruducts: Product[]) {
        this.productToBuy = new Sale();
        this.productToBuy.detailSale = [];
        this.productToBuy.user = this.authService.getUserLogged();
        const ids = localStorage.getItem('shoppingCar').split('');
        pruducts.forEach(prod => {
            const detailsale = new DetailSale();
            detailsale.product = prod;
            let numbersProduct = 0;
            ids.map(id => {
                if (prod.id === +id) {
                    numbersProduct++;
                }
            });
            detailsale.numberProducts = numbersProduct;
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

        this.apiService.addElement(this.urlSaleController + '/saveSale', this.productToBuy)
            .subscribe(
                result => {
                    this.notify.success('The Sale saved correctly');
                    localStorage.removeItem('shoppingCar');
                    this.router.navigate(['/home']);
                    this.shopping.tobuy();
                    this.closeModal();
                },
                error => {
                    console.error(error);
                    this.notify.error('An error has occurred in save the sale');
                }
            );
    }

}
