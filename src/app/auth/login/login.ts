import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterEvent } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';

import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginAuth } from '../services/login-auth';
import { catchError, of, tap } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    CommonModule,
    InputGroupModule,
    InputTextModule,
    InputGroupAddonModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    CardModule,
  ],
})
export class Login {
  faGraduationCap = faGraduationCap;
  formLogin: FormGroup;
  loginAuth = inject(LoginAuth);

  router = inject(Router);

  loading = false;
  year = new Date().getFullYear();
  submitted: boolean = false;
  isStudent: boolean = true;

  constructor() {
    this.isStudent = this.router.url.split('/')[1] === 'admin' ? false : true;
    this.formLogin = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  accessLogin() {
    this.submitted = true;
    if (this.formLogin.valid) {
      this.loginAuth
        .login(this.formLogin.getRawValue())
        .pipe(
          tap((value) => {
            console.log('el Ok es', value);
            localStorage.setItem(this.loginAuth.tokenAccess, value.access);
            localStorage.setItem(this.loginAuth.tokenRefresh, value.refresh);
            localStorage.setItem(this.loginAuth.tokenUser, JSON.stringify(value.user));
            this.loginAuth.isAuthenticatedSubject.next(true);
            if (value.user.tipo === 'student') this.router.navigateByUrl('note');
            else this.router.navigateByUrl('graphic');
          }),
        )
        .subscribe();
    }
  }
  campoInvalido(campo: string): boolean {
    const control = this.formLogin.get(campo);
    if (!control) return false;

    if (this.submitted) {
      return control.invalid;
    }
    return control.invalid && control.touched;
  }
}
