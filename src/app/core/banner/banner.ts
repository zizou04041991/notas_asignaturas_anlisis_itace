import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faBell,
  faEnvelope,
  faSearch,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { LoginAuth } from '../../auth/services/login-auth';

@Component({
  selector: 'app-banner',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {
  @Input() titulo: string = 'Inicio'; // Cambiado de 'Dashboard' a 'Inicio'
  @Output() toggleMenu = new EventEmitter<void>();

  faBars = faBars;

  faUserCircle = faUserCircle;
  authService = inject(LoginAuth);
  user = JSON.parse(localStorage.getItem(this.authService.tokenUser) as string);
}
