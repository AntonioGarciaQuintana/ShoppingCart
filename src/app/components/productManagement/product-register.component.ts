import { NotifyService } from './../../commons/services/notify.service';
import { Product } from './../../model/product';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../commons/services/api-service.service';
import { Document } from '../../model/document';


@Component({
  selector: 'app-product-register',
  //  styleUrls: ['./product-register.component.css'],
  templateUrl: './product-register.component.html'
})
export class RegisterProductComponent implements OnInit {

  idProducto = 0;
  categories: any[] = [];
  classifications: any[] = [];
  genres: any[] = [];
  productFormGroup: FormGroup;
  showSectionBook = false;
  showSectionMovie = false;
  urlProductController = '/product';
  idDocumentSaved = 0;
  nameFile = 'Choose image';

  constructor(
    private route: ActivatedRoute
    , private router: Router
    , private apiService: ApiService
    , private notify: NotifyService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idProducto = params['id'] !== undefined ? +params['id'] : 0;
      if (this.idProducto !== 0) {
        this.getAndSetProduct(this.idProducto);
      }
    });

    this.productFormGroup = new FormGroup({
      categoryControl: new FormControl('', Validators.required),
      activeControl: new FormControl('', Validators.required),
      nameControl: new FormControl('', Validators.required),
      priceControl: new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]),
      stockControl: new FormControl('', Validators.required),
      descriptionControl: new FormControl(''),
      ISBNControl: new FormControl('', Validators.required),
      titleBookControl: new FormControl('', Validators.required),
      authorBookControl: new FormControl('', Validators.required),
      classificationControl: new FormControl('', Validators.required),
      genreControl: new FormControl('', Validators.required)
    });

    this.productFormGroup.controls['activeControl'].setValue(true);
    this.getEnums();
    this.eventsControls();
  }

  getAndSetProduct(idProduct) {
    this.apiService.getElement(this.urlProductController + '/getProduct', idProduct)
      .subscribe(
        result => {
          this.onEdit(result);
        },
        error => {
          console.log(error);
        }

      );
  }

  onEdit(product: Product) {
    this.idProducto = product.id;
    this.idDocumentSaved = product.document.id;
    this.nameFile = product.document.docName;
    this.productFormGroup.controls['categoryControl'].setValue(product.category);
    this.updateValidators(product.category);

    this.productFormGroup.controls['nameControl'].setValue(product.name);
    this.productFormGroup.controls['priceControl'].setValue(product.price);
    this.productFormGroup.controls['stockControl'].setValue(product.stock);
    this.productFormGroup.controls['descriptionControl'].setValue(product.description);
    this.productFormGroup.controls['activeControl'].setValue(product.active);
    if (product.category === 'BOOK') {
      this.productFormGroup.controls['ISBNControl'].setValue(product.isbn);
      this.productFormGroup.controls['titleBookControl'].setValue(product.title);
      this.productFormGroup.controls['authorBookControl'].setValue(product.author);
    } else {
      this.productFormGroup.controls['classificationControl'].setValue(product.classification);
      this.productFormGroup.controls['genreControl'].setValue(product.genre);
    }
  }

  getEnums() {
    this.getCategories();
    this.getClassifications();
    this.getGenres();
  }

  getClassifications() {
    this.apiService.getElements('/classifications')
      .subscribe(
        result => {
          this.classifications = result;
        },
        error => {
          console.log(error);
        }
      );
  }
  getGenres() {
    this.apiService.getElements('/genres')
      .subscribe(
        result => {
          this.genres = result;
        },
        error => {
          console.log(error);
        }
      );
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

  eventsControls() {

    this.productFormGroup.get('categoryControl')
      .valueChanges
      .debounceTime(100)
      .subscribe(res => {
        this.showSectionBook = res === 'BOOK' ? true : false;
        this.showSectionMovie = res === 'MOVIE' ? true : false;
        this.updateValidators(res);
      });

  }

  updateValidators(productType: string) {
    if (productType === 'MOVIE') {
      this.productFormGroup.controls['ISBNControl'].setValidators([]);
      this.productFormGroup.controls['titleBookControl'].setValidators([]);
      this.productFormGroup.controls['authorBookControl'].setValidators([]);
      this.productFormGroup.controls['classificationControl'].setValidators([Validators.required]);
      this.productFormGroup.controls['genreControl'].setValidators([Validators.required]);

      this.productFormGroup.controls['ISBNControl'].updateValueAndValidity();
      this.productFormGroup.controls['titleBookControl'].updateValueAndValidity();
      this.productFormGroup.controls['authorBookControl'].updateValueAndValidity();
      this.productFormGroup.controls['classificationControl'].updateValueAndValidity();
      this.productFormGroup.controls['genreControl'].updateValueAndValidity();
    } else {
      this.productFormGroup.controls['ISBNControl'].setValidators([Validators.required]);
      this.productFormGroup.controls['titleBookControl'].setValidators([Validators.required]);
      this.productFormGroup.controls['authorBookControl'].setValidators([Validators.required]);
      this.productFormGroup.controls['classificationControl'].setValidators([]);
      this.productFormGroup.controls['genreControl'].setValidators([]);

      this.productFormGroup.controls['ISBNControl'].updateValueAndValidity();
      this.productFormGroup.controls['titleBookControl'].updateValueAndValidity();
      this.productFormGroup.controls['authorBookControl'].updateValueAndValidity();
      this.productFormGroup.controls['classificationControl'].updateValueAndValidity();
      this.productFormGroup.controls['genreControl'].updateValueAndValidity();
    }

  }

  onCancel() {
    this.productFormGroup.reset();
    this.idDocumentSaved = 0;
  }

  getObjectProduct(formValue: any) {
    const product = new Product();
    const doc = new Document;

    doc.id = this.idDocumentSaved;
    product.id = this.idProducto;
    product.document = doc;
    product.category = formValue.categoryControl;
    if (formValue.categoryControl === 'BOOK') {
      product.isbn = formValue.ISBNControl;
      product.title = formValue.titleBookControl;
      product.author = formValue.authorBookControl;
    } else {
      product.classification = formValue.classificationControl;
      product.genre = formValue.genreControl;
    }
    product.name = formValue.nameControl;
    product.price = formValue.priceControl;
    product.stock = formValue.stockControl;
    product.description = formValue.descriptionControl;
    product.active = formValue.activeControl;

    return product;

  }

  onSaveProduct(): void {
    if (this.validationDocument()) {
      const method = this.productFormGroup.controls['categoryControl'].value;
      this.apiService.addElement(this.urlProductController + (method === 'BOOK' ? '/saveProductBook' : '/saveProductMovie')
        , this.getObjectProduct(this.productFormGroup.value))
        .subscribe(
          result => {
            this.notify.success('The product saved correctly');
            this.onCancel();
            this.router.navigate(['/productManagement']);
          },
          error => {
            this.notify.error('Ha ocurrido un error al guardar el producto');
          }
        );
    } else {
      this.notify.info('Is necesary upload a image');
    }

  }

  validationDocument(): boolean {
    return this.idDocumentSaved !== 0 ? true : false;
  }

  documentSaved(value) {
    this.idDocumentSaved = value;
  }

}
