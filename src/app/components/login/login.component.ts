import { ApiService } from './../../commons/services/api-service.service';

// import { User } from './../../model/user';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../commons/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { NotifyService } from '../../commons/services/notify.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-login',
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    user: User = new User();
    loginForm: FormGroup;
    userForm: FormGroup;
    modalRef: NgbModalRef;
    emailPattern = '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$';
    constructor(
        private authService: AuthService
        , private router: Router
        , private notify: NotifyService
        , private modalService: NgbModal
        , private apiService: ApiService) {
    }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            username: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
            password: new FormControl('', [Validators.required])
        });
        this.userForm = new FormGroup({
            registerFullName: new FormControl('', [Validators.required]),
            registerUsername: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
            registerPassword: new FormControl('', [Validators.required])
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

    openRegisterUserModal(content) {

        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
            console.log(`Closed with: ${result}`);
        }, (reason) => {
            console.log(`Dismissed ${this.getDismissReason(reason)}`);
        });
    }


    private getDismissReason(reason: any): string {
        this.resetFormUser();
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
        this.resetFormUser();
    }

    registerUser() {
        this.apiService.addElement('/account/register', this.getObjectUser(this.userForm.value))
            .subscribe(
                result => {
                   this.notify.success('The user was saved successfully');
                   this.closeModal();
                },
                error => {
                    this.notify.error(error.error);
                }
            );
    }
    getObjectUser(formValue: any): User {
        const user: User = new User();
        user.fullName = formValue.registerFullName;
        user.username = formValue.registerUsername;
        user.password = formValue.registerPassword;
        return user;

    }
    resetFormUser() {
        this.userForm.reset();
    }
}
