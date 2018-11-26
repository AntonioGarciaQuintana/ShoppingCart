import { HavePermissionAdmin } from './commons/services/have-permission.permission';
import { AuthService } from './commons/services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { DetailShoppingComponent } from './components/detail-shopping/detail-shopping.component';
import { ShoppingCarServive } from './commons/services/shopping-car.service';
import { FormUploadComponent } from './components/form-upload/form-upload.component';
import { HomeComponent } from './components/home/home.component';
import { ApiService } from './commons/services/api-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './app.routing';
import { ProductManagementComponent } from './components/productManagement/product-management.component';
import { RegisterProductComponent } from './components/productManagement/product-register.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NotifyService } from './commons/services/notify.service';
import { OnlyNumbersDirective } from './commons/directives/only-numbers.directive';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductManagementComponent,
    RegisterProductComponent,
    FormUploadComponent,
    OnlyNumbersDirective,
    DetailShoppingComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SnotifyModule,
    routing,
    NgbModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    ApiService,
    NotifyService,
    ShoppingCarServive,
    HavePermissionAdmin,
    AuthService
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
