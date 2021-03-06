import { DetailSale } from './../../model/detai-sale';
import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../commons/services/api-service.service';
import { Product } from '../../model/product';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NotifyService } from '../../commons/services/notify.service';
import { ShoppingCarServive } from '../../commons/services/shopping-car.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    selector: 'app-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    products: Product[] = [];
    shoppingCart: DetailSale[] = [];
    categories: any[] = [];
    urlProductController = '/product';
    modalRef: NgbModalRef;
    productSelected: Product;
    productAdded = new EventEmitter();
    numersProducrts = 1;

    // pagination properties
    currentPage = 0;
    sorting = 'id,desc';
    totalElements = 0;
    pageSize = 10;



    searchProductFormGroup: FormGroup;
    constructor(private apiService: ApiService
        , private modalService: NgbModal
        , private notify: NotifyService
        , private shopping: ShoppingCarServive
        , private spinnerService: Ng4LoadingSpinnerService) {
    }

    ngOnInit(): void {
        this.searchProductFormGroup = new FormGroup({
            defaultSizePage: new FormControl(''),
            searchProducto: new FormControl(''),
            category: new FormControl('')
        });

        this.searchProductFormGroup.controls['defaultSizePage'].setValue(10);
        this.eventsSearch();
        this.firstPage();
        this.getCategories();
    }

    eventsSearch() {
        this.searchProductFormGroup.get('defaultSizePage')
            .valueChanges
            .debounceTime(800)
            .subscribe(res => {
                if (res !== undefined && res !== null && +res !== 0) {
                    this.firstPage();
                }
            });
        this.searchProductFormGroup.get('searchProducto')
            .valueChanges
            .debounceTime(800)
            .subscribe(res => {
                this.firstPage();
            });
        this.searchProductFormGroup.get('category')
            .valueChanges
            .debounceTime(800)
            .subscribe(res => {
                this.firstPage();
            });
    }

    getCategories() {
        this.apiService.getElements('/categories')
            .subscribe(
                result => {
                    this.categories = result;
                },
                error => {
                    console.log(error);
                }
            );
    }

    getProducts() {
        this.apiService.getElements('/product/products')
            .subscribe(
                result => {
                    this.products = result;
                },
                error => {
                    console.log(error);
                }
            );
    }

    firstPage() {
        this.currentPage = 0;
        this.getPage(this.currentPage);
    }

    getPage(page: number) {

        if (this.searchProductFormGroup.controls['defaultSizePage'].value !== '') {
            this.pageSize = this.searchProductFormGroup.controls['defaultSizePage'].value;
            const search = this.searchProductFormGroup.controls['searchProducto'].value;
            const category = this.searchProductFormGroup.controls['category'].value;
            this.spinnerService.show();
            this.apiService.getPagesSort(this.urlProductController + '/getPage', page, this.pageSize, this.sorting, search, category)
                .subscribe(
                    result => {
                        this.products = result.content;
                        this.totalElements = result.totalElements;
                        this.spinnerService.hide();
                    },
                    error => {
                        console.log(error);
                        this.spinnerService.hide();
                    }
                );
        }
    }

    pageChanged(page: number) {
        const currentPage = (page - 1);
        this.getPage(currentPage);
    }



    openModalConfirmation(productSelected: Product, content) {
        this.numersProducrts = 1;
        this.productSelected = productSelected;
        this.modalRef = this.modalService.open(content, { size: 'lg' });
        this.modalRef.result.then((result) => {
            console.log(`Closed with: ${result}`);
        }, (reason) => {
            console.log(`Dismissed ${this.getDismissReason(reason)}`);
        });


    }

    private getDismissReason(reason: any): string {
        this.productSelected = new Product();
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    closeModal() {
        this.productSelected = new Product();
        this.modalRef.close();
    }


    addToCar(product: Product) {
        this.shopping.addToCar(product, this.numersProducrts);
        this.closeModal();
        this.notify.success('was add to shopping car the product: ' + product.name);
    }

    onRest() {
        if (this.numersProducrts > 1) {
            this.numersProducrts--;
        }
    }
    onSum() {
        if (this.numersProducrts < 999 ) {
            this.numersProducrts++;
        }
    }

}
