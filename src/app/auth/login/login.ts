import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginAuth } from '../services/login-auth';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
})
export class Login  {
  faGraduationCap = faGraduationCap;
  formLogin: FormGroup;
  loginAuth = inject(LoginAuth);
  router = inject(Router);

  loading = false;
  year = new Date().getFullYear();
  isStudent: boolean = true;

  constructor() {
    this.isStudent = this.router.url.split('/')[1] === 'admin' ? false : true;
    this.formLogin = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }



  accessLogin() {
 

    if (this.formLogin.valid) {
      this.loading = true;
      this.loginAuth
        .login(this.formLogin.getRawValue())
        .pipe(
          tap((value) => {
            localStorage.setItem(this.loginAuth.tokenAccess, value.access);
            localStorage.setItem(this.loginAuth.tokenRefresh, value.refresh);
            localStorage.setItem(this.loginAuth.tokenUser, JSON.stringify(value.user));
            this.loginAuth.isAuthenticatedSubject.next(true);
            if (value.user.tipo === 'student') this.router.navigateByUrl('note');
            else this.router.navigateByUrl('graphic');
          })
        )
        .subscribe({
          next: () => (this.loading = false),
          error: () => (this.loading = false),
        });
    } else {
      this.loading = false;
      // Opcional: mostrar un toast o mensaje global
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.formLogin.get(campo);
    // Solo se muestra error si el campo es inválido Y ha sido tocado (focus + blur)
    return control ? control.invalid && control.touched : false;
  }
}