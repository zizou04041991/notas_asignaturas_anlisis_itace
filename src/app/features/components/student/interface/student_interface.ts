export interface StudentInterface {
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
}
