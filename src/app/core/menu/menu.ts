import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  OnInit,
  inject,
  OnDestroy,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGraduationCap, faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { RUTAS_CONFIG, getRutasParaMenu } from '../rutas.config';
import { LoginAuth } from '../../auth/services/login-auth';
import { AdminInterface, StudentInterface } from '../constant/user-login';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class Menu implements OnInit,OnDestroy {
  year = new Date().getFullYear();
  @Input() menuAbierto = false;
  @Output() menuAbiertoChange = new EventEmitter<boolean>();

  isMobile = window.innerWidth < 768;
  authService = inject(LoginAuth);
  userType: AdminInterface
      | StudentInterface = JSON.parse(localStorage.getItem(this.authService.tokenUser) as string);

  rutasMenu =
    this.userType.tipo === 'student'
      ? getRutasParaMenu().filter((v) => v.user === 'all')
      : getRutasParaMenu();

  // Iconos de FontAwesome
  faGraduationCap = faGraduationCap;
  faUserCircle = faUserCircle;
  faTimes = faTimes;

  ngOnInit() {
    // Asegurar que el sidebar tenga la altura correcta al iniciar
    this.ajustarAltura();
  }
  ngOnDestroy(): void {
    this.authService.logout();
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
