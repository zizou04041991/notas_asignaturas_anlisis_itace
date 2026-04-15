import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBook,
  faLayerGroup,
  faUsers,
  faChartBar,
  faChartLine,
  faFileLines,
  faSignOutAlt,
  faKey,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';

export interface RutaConfig {
  path: string;
  titulo: string;
  icono: IconDefinition;
  exact?: boolean;
  user: 'all' | 'admin';
}

export const RUTAS_CONFIG: RutaConfig[] = [
  {
    path: '/semester',
    titulo: 'Semestres',
    icono: faLayerGroup,
    exact: true,
    user: 'admin',
  },
  {
    path: '/tcp',
    titulo: 'TCP',
    icono: faFileLines,
    user: 'admin',
  },
  {
    path: '/subject',
    titulo: 'Asignaturas',
    icono: faBook,
    user: 'admin',
  },
  {
    path: '/student',
    titulo: 'Estudiantes',
    icono: faUsers,
    user: 'admin',
  },
  {
    path: '/note',
    titulo: 'Calificaciones',
    icono: faChartBar,
    user: 'all',
  },
  {
    path: '/graphic',
    titulo: 'Gráfica Calificaciones',
    icono: faChartLine,
    user: 'admin',
  },
  {
    path: '/user-admin',
    titulo: 'Adminstradores',
    icono: faUserShield,
    user: 'admin',
  },
  {
    path: '/change-password',
    titulo: 'Cambiar Clave',
    icono: faKey,
    user: 'all',
  },
  {
    path: '/login',
    titulo: 'Salir',
    icono: faSignOutAlt,
    user: 'all',
  },
];

// Helper para obtener título por ruta
export function getTituloPorRuta(ruta: string): string {
  // Si la ruta está vacía o es la raíz
  if (!ruta || ruta === '/') {
    return 'Inicio';
  }

  // Buscar coincidencia exacta
  const configExacta = RUTAS_CONFIG.find((r) => r.path === ruta);
  if (configExacta) {
    return configExacta.titulo;
  }

  // Si no hay coincidencia exacta, buscar coincidencia parcial (para rutas con parámetros)
  const rutaBase = '/' + ruta.split('/')[1];
  const configBase = RUTAS_CONFIG.find((r) => r.path === rutaBase);

  return configBase?.titulo || 'Inicio'; // Ya no devuelve 'Dashboard'
}

// Helper para obtener todas las rutas (sin el '/' inicial)
export function getRutasParaMenu(): {
  path: string;
  titulo: string;
  icono: IconDefinition;
  exact?: boolean;
  user: string;
}[] {
  return RUTAS_CONFIG;
}
