import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class HavePermissionAdmin implements CanActivate {
    isAdmin = false;
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            this.isAdmin = user.role === 'ADMIN' ? true : false;
            if (!this.isAdmin) {
                this.router.navigate(['/home'], {});
            }
            return this.isAdmin;
        }


        this.router.navigate(['/home'], {});
        return false;
    }
}
