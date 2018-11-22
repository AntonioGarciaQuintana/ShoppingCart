import { FormControl, Validators } from '@angular/forms';
// import { User } from './../../model/user';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../commons/services/auth.service';

import { Router } from '@angular/router';
import { User } from '../../model/user';
import { FormGroup } from '@angular/forms';
import { NotifyService } from '../../commons/services/notify.service';
@Component({
    selector: 'app-login',
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    user: User = new User();
    loginForm: FormGroup;
    emailPattern = '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$';
    constructor(private authService: AuthService, private router: Router, private notify: NotifyService) {
    }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            username: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
            password: new FormControl('', [Validators.required])
        });
    }

    login() {
        this.authService.logIn(this.user)
            .subscribe(data => {
                this.router.navigate(['/home']);

            }, error => {
                this.notify.error('The password or username are incorrects.');
            }
            );
    }

}
