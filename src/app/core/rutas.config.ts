import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBook,
  faLayerGroup,
  faUsers,
  faChartBar,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

export interface RutaConfig {
  path: string;
  titulo: string;
  icono: IconDefinition;
  exact?: boolean;
}

export const RUTAS_CONFIG: RutaConfig[] = [
  {
    path: '/semester',
    titulo: 'Semestres',
    icono: faLayerGroup,
    exact: true,
  },
  {
    path: '/subject',
    titulo: 'Asignaturas',
    icono: faBook,
  },
  {
    path: '/student',
    titulo: 'Estudiantes',
    icono: faUsers,
  },
  {
    path: '/note',
    titulo: 'Notas',
    icono: faChartBar,
  },
  {
    path: '/graphic',
    titulo: 'Gráfica Notas',
    icono: faChartLine,
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
}[] {
  return RUTAS_CONFIG;
}
