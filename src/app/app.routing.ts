import { LoginComponent } from './components/login/login.component';

import { DetailShoppingComponent } from './components/detail-shopping/detail-shopping.component';
import { HomeComponent } from './components/home/home.component';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ProductManagementComponent } from './components/productManagement/product-management.component';
import { RegisterProductComponent } from './components/productManagement/product-register.component';
import { HavePermissionAdmin } from './commons/services/have-permission.permission';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'productManagement', component: ProductManagementComponent, canActivate: [HavePermissionAdmin] },
    { path: 'productRegister', component: RegisterProductComponent },
    { path: 'detailShopping', component: DetailShoppingComponent },
    { path: 'login', component: LoginComponent },


    // otherwise redirect to home
    { path: '**', redirectTo: '/home' }
  ];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
