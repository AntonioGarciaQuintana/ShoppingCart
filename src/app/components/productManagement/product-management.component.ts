import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../model/product';
import { ApiService } from '../../commons/services/api-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotifyService } from '../../commons/services/notify.service';

@Component({
    selector: 'app-product-management',
    // styleUrls: ['./product-management.component.css'],
    templateUrl: './product-management.component.html'
})
export class ProductManagementComponent implements OnInit {
    products: Product[] = [];
    categories: any[] = [];
    productSelected: Product;
    urlProductController = '/product';
    searchProductFormGroup: FormGroup;
    modalRef: NgbModalRef;

    // pagination properties
    currentPage = 0;
    pageSize = 10;
    sorting = 'id,desc';
    totalElements = 0;
    constructor(
        private apiService: ApiService
        , private router: Router
        , private modalService: NgbModal
        , private notify: NotifyService
    ) {
    }

    ngOnInit(): void {
        this.searchProductFormGroup = new FormGroup({
            defaultSizePage: new FormControl(''),
            searchProduct: new FormControl(''),
            category: new FormControl('')
        });
        this.searchProductFormGroup.controls['defaultSizePage'].setValue(10);
        this.getCategories();
        this.firstPage();
        this.eventsSearch();
    }

    eventsSearch() {
        this.searchProductFormGroup.get('defaultSizePage')
            .valueChanges
            .debounceTime(800)
            .subscribe(res => {
                this.firstPage();
            });
        this.searchProductFormGroup.get('searchProduct')
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


    firstPage() {
        this.currentPage = 0;
        this.getPage(this.currentPage);
    }

    getPage(page: number) {

        if (this.searchProductFormGroup.controls['defaultSizePage'].value !== '') {
            this.pageSize = this.searchProductFormGroup.controls['defaultSizePage'].value;
            const search = this.searchProductFormGroup.controls['searchProduct'].value;
            const category = this.searchProductFormGroup.controls['category'].value;
            this.apiService.getPagesSort(this.urlProductController + '/getPageAll', page, this.pageSize, this.sorting, search, category)
                .subscribe(
                    result => {
                        this.products = result.content;
                        this.totalElements = result.totalElements;
                    },
                    error => {
                        console.log(error);
                    }
                );
        }
    }

    pageChanged(page: number) {
        const currentPage = (page - 1);
        this.getPage(currentPage);
    }

    onDeleteProduct() {
        this.apiService.deleteElement(this.urlProductController + '/DeleteProduct', this.productSelected.id)
            .subscribe(
                result => {
                    this.notify.success('The producto was deleted correctly');
                    this.firstPage();
                    this.closeModal();
                },
                error => {
                    this.notify.error('Ha ocurrido un error al eliminar el producto');
                }
            );
    }

    onEdit(product: Product) {
        this.router.navigate(['/productRegister', { id: product.id }]);
    }

    openModalConfirmation(productSelected: Product, content) {
        this.productSelected = productSelected;
        this.modalRef = this.modalService.open(content);
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
        this.modalRef.close();
    }
}
