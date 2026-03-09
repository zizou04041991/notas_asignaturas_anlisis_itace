import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBars, 
  faBell, 
  faEnvelope, 
  faSearch,
  faUserCircle 
} from '@fortawesome/free-solid-svg-icons';

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
  faBell = faBell;
  faEnvelope = faEnvelope;
  faSearch = faSearch;
  faUserCircle = faUserCircle;
}