import { ChangeDetectorRef, Component, computed, inject, signal, ViewChild } from '@angular/core';
import { StudentService } from './services/student_service';
import { StudentInterface } from './interface/student_interface';
import { CommonModule } from '@angular/common';
import { ColumnConfig, Table } from '../../../shared/components/table/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditAddStudent } from './edit-add-student/edit-add-student';

@Component({
  selector: 'app-student',
  imports: [CommonModule, ConfirmDialogModule, Table],
  templateUrl: './student.html',
  styleUrl: './student.css',
  providers: [DialogService, ConfirmationService],
})
export class Student {
  private studentService = inject(StudentService);
  /*students: StudentInterface[] = [];
  loading: boolean = false;
  totalRecords: number = 0;*/
  ref: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);

  @ViewChild(Table) tableComponent!: Table;

  // Configuración de columnas
  columns: ColumnConfig[] = [
    {
      field: 'curp',
      header: 'CURP',
      width: '25%',
      sortable: false,
      filterable: true,
    },
    {
      field: 'nombre',
      header: 'Nombre',
      width: '25%',
      sortable: false,
      filterable: true,
    },
    {
      field: 'apellidos',
      header: 'Apellidos',
      width: '25%',
      sortable: false,
      filterable: true,
    },
    {
      field: 'semestre_numero',
      header: 'Semestre',
      width: '25%',
      sortable: false,
      filterable: true,
      //type: 'custom', // Personalizado para mostrar el número del semestre
    },
  ];

  private confirmationService = inject(ConfirmationService);

  students = signal<StudentInterface[]>([]);
  loading = signal<boolean>(false);
  totalRecords = computed(() => this.students().length);

  confirm(id: number) {
    this.confirmationService.confirm({
      message: 'Desea eliminar este registro?',
      header: 'Eliminar',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },

      accept: () => {
        this.studentService.deleteStudent(id).subscribe(
          (value) => {
            this.loadStudents();
          },
          (error) => {},
        );
      },
      reject: () => {},
    });
  }

  constructor(public cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents(params?: any) {
    this.loading.set(true);
    this.studentService.getStudents(params).subscribe({
      next: (data) => {
        this.students.set(
          data.map((student: any) => ({
            ...student,
            semestre_numero: student.semestre_actual?.numero,
          })),
        );

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando estudiantes:', error);
        this.loading.set(false);
      },
    });
  }

  addStudent() {
    this.ref = this.dialogService.open(EditAddStudent, {
      header: 'Adicionar Estudiante',
      modal: true,
      closable: true,
      focusOnShow: false,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    }) as any;

    this.ref!.onClose.subscribe((formResponse: any) => {
      if (formResponse) {
        this.studentService.createStudent(formResponse).subscribe(
          (value) => {
            this.loadStudents();
          },
          (error) => {},
        );
      }
    });
  }

  onEditStudent(data: StudentInterface) {
    this.ref = this.dialogService.open(EditAddStudent, {
      header: 'Editar Estudiante',
      modal: true,
      closable: true,
      focusOnShow: false,
      width: '70%',
      data,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    }) as any;

    this.ref!.onClose.subscribe((formResponse: any) => {
      if (formResponse) {
        this.studentService.updateStudent(data.id, formResponse).subscribe(
          (value) => {
            this.loadStudents();
          },
          (error) => {},
        );
      }
    });
  }

  onDeleteStudent(event: StudentInterface) {
    this.confirm(event.id);
  }
}
