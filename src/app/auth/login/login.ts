import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';

import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { 
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


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
  
  loginData = {
    numeroControl: '',
    password: ''
  };

  loading = false;
  errorMessage = '';
  year = new Date().getFullYear();

  constructor(private router: Router) {}

  onLogin() {
    this.errorMessage = '';
    this.loading = true;

    // Simulación de login - aquí iría tu lógica real
    setTimeout(() => {
      if (this.loginData.numeroControl === 'admin' && this.loginData.password === 'admin') {
        // Login exitoso
        this.router.navigate(['/dashboard']);
      } else {
        // Login fallido
        this.errorMessage = 'Número de control o contraseña incorrectos';
        this.loading = false;
      }
    }, 1500);
  }
}