import { ShoppingCarServive } from './shopping-car.service';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { BaseUrl } from '../../../base_url';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {

    base: BaseUrl = new BaseUrl();


    constructor(public http: Http, private shoopingService: ShoppingCarServive) { }

    public logIn(user: any) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        const base64Credential: string = btoa(user.username + ':' + user.password);
        headers.append('Authorization', 'Basic ' + base64Credential);

        const options = new RequestOptions();
        options.headers = headers;

        return this.http.get(this.base.urlBackend + '/account/login', options)
            .map((response: Response) => {

                // tslint:disable-next-line:no-shadowed-variable
                const user = response.json().principal;

                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.shoopingService.toLogin();
                }
            });
    }

    logOut() {
        localStorage.clear();
        localStorage.removeItem('shoppingCar');
        this.shoopingService.toLogout();
        return this.http.post(this.base.urlBackend + 'logout', {})
            .map((response: Response) => {
                localStorage.removeItem('currentUser');
            });

    }

    getUserLogged() {
        if (localStorage.getItem('currentUser')) {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            return user;
        }

        return null;
    }
    isLogged() {
        if (localStorage.getItem('currentUser')) {
            return true;
        }
        return false;
    }

}
