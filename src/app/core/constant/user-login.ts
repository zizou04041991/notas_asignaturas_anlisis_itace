export interface AdminInterface {
  id: number;
  tipo: 'admin';
  nombre: string;
  apellidos: string;
  username: string;
}
export interface StudentInterface {
  id: number;
  tipo: 'student';
  nombre: string;
  apellidos: string;
  numero_control: string;
  curp: string;
  semestre: number;
}
