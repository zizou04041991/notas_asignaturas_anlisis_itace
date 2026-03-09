import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { Menu } from '../menu/menu';
import { Banner } from '../banner/banner';
import { getTituloPorRuta } from '../rutas.config';

@Component({
  selector: 'app-contain',
  standalone: true,
  imports: [CommonModule, RouterModule, Menu, Banner],
  templateUrl: './contain.html',
  styleUrls: ['./contain.css'],
})
export class Contain implements OnInit {
  menuAbierto = false;
  tituloPagina = 'Inicio'; // Cambiado de 'Dashboard' a 'Inicio'

  constructor(private router: Router) {}

  ngOnInit() {
    // Actualizar título al iniciar
    this.actualizarTitulo(this.router.url);
    
    // Suscribirse a cambios de navegación
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.actualizarTitulo(event.url);
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth >= 768) {
      this.menuAbierto = false;
    }
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  onMenuAbiertoChange(abierto: boolean) {
    this.menuAbierto = abierto;
  }

  private actualizarTitulo(url: string) {
    // Limpiar la URL de posibles query params
    const urlSinQuery = url.split('?')[0];
    
    // Obtener la ruta base (primer segmento)
    const rutaBase = '/' + urlSinQuery.split('/')[1];
    
    // Obtener el título usando el helper
    this.tituloPagina = getTituloPorRuta(rutaBase);
  
  }
}