import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faGraduationCap, 
  faUserCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { RUTAS_CONFIG, getRutasParaMenu } from '../rutas.config';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  year = new Date().getFullYear();
  @Input() menuAbierto = false;
  @Output() menuAbiertoChange = new EventEmitter<boolean>();
  
  isMobile = window.innerWidth < 768;
  rutasMenu = getRutasParaMenu();

  // Iconos de FontAwesome
  faGraduationCap = faGraduationCap;
  faUserCircle = faUserCircle;
  faTimes = faTimes;

  ngOnInit() {
    // Asegurar que el sidebar tenga la altura correcta al iniciar
    this.ajustarAltura();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
    if (!this.isMobile) {
      this.menuAbierto = false;
      this.menuAbiertoChange.emit(false);
    }
    this.ajustarAltura();
  }

  private ajustarAltura() {
    // Forzar altura completa
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
  }

  cerrarMenu() {
    this.menuAbierto = false;
    this.menuAbiertoChange.emit(false);
  }

  cerrarMenuEnMovil() {
    if (this.isMobile) {
      this.cerrarMenu();
    }
  }
}