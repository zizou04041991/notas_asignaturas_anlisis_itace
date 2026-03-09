export interface NoteInterface {
  id: number;
  estudiante: {
    id: number;
    curp: string;
    nombre: string;
    apellidos: string;
    semestre_actual: {
      id: number;
      numero: number;
    };
    nombre_completo: string;
    fecha_registro: string;
    fecha_actualizacion: string;
  };
  asignatura: {
    id: number;
    nombre: string;
    color: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
  };
  semestre_cursado: {
    id: number;
    numero: number;
  };
  nota: number;
  fecha_registro: string;
  fecha_actualizacion: string;
}
