import { AuthService } from './commons/services/auth.service';
import { User } from './model/user';
import { Component, OnInit } from '@angular/core';
import { ShoppingCarServive } from './commons/services/shopping-car.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userLogin: User;
  numElements = 0;
  isLogged = false;
  isAdmin = false;
  constructor(private shopping: ShoppingCarServive, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.coutElements();
    this.onVerifyLogin();
    this.isloggued();
    this.shopping.addtoCarEmmiter.subscribe(evet => {
      this.coutElements();
    });

    this.shopping.toBuyEmmiter.subscribe(evet => {
      this.coutElements();
    });

    this.shopping.tologinEmmiter.subscribe(evet => {
      this.isLogged = true;
      this.onVerifyLogin();
    });

    this.shopping.tologoutEmmiter.subscribe(evet => {
      this.isLogged = false;
      this.onVerifyLogin();
      this.coutElements();
    });

  }

  coutElements() {
    this.numElements = this.shopping.coutElements();
  }

  onVerifyLogin() {

    if (this.authService.isLogged()) {
      this.userLogin = this.authService.getUserLogged();
      this.isAdmin = this.userLogin.role === 'ADMIN' ? true : false;
    } else {
      this.userLogin = null;
      this.isAdmin = false;
    }

  }

  onLogout() {
    this.authService.logOut();
    this.router.navigate(['/Home']);
  }

  isloggued() {
    this.isLogged = this.authService.isLogged();
  }
}
