import { ChangeDetectorRef, Component, computed, inject, signal, ViewChild } from '@angular/core';
import { StudentService } from './services/student_service';
import { StudentInterface } from './interface/student_interface';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditAddStudent } from './edit-add-student/edit-add-student';
import { ToastService } from '../../../shared/services/toast.service';
import {
  FiltersState,
  ReusableTable,
  TableConfig,
} from '../../../shared/components/reusable-table/reusable-table';
import { TableLazyLoadEvent } from 'primeng/table';
import { Password } from 'primeng/password';
import { catchError, of, tap } from 'rxjs';
import { LoginAuth } from '../../../auth/services/login-auth';

@Component({
  selector: 'app-student',
  imports: [CommonModule, ConfirmDialogModule, ReusableTable],
  templateUrl: './student.html',
  styleUrl: './student.css',
  providers: [DialogService, ConfirmationService],
})
export class Student {
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  authService = inject(LoginAuth);

  @ViewChild(ReusableTable) reusableTable!: ReusableTable;

  ref: DynamicDialogRef | null = null;

  // Signals para datos
  students = signal<any[]>([]);
  loading = signal<boolean>(false);
  totalRecords = signal<number>(0);

  // Signals para el estado de la tabla
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  currentSortField = signal<string>('apellidos');
  currentSortOrder = signal<number>(1);
  currentFilters = signal<FiltersState>({});

  // Signal computada para construir los parámetros de la URL
  queryParams = computed(() => {
    const page = this.currentPage() + 1; // La API espera página empezando en 1
    const pageSize = this.pageSize();
    const sortField = this.currentSortField();
    const sortOrder = this.currentSortOrder();
    const filters = this.currentFilters();

    let params = `?page=${page}&page_size=${pageSize}`;

    // Agregar ordenamiento
    if (sortField) {
      const order = sortOrder === -1 ? '-' : '';
      params += `&ordering=${order}${sortField}`;
    }

    // Agregar filtros activos
    Object.entries(filters).forEach(([key, filter]) => {
      if (filter?.value !== null && filter?.value !== undefined && filter?.value !== '') {
        // Escapar el valor para la URL
        const encodedValue = encodeURIComponent(filter.value);
        params += `&${key}=${encodedValue}`;
      }
    });

    return params;
  });

  // Señal computada para verificar si hay filtros activos
  hasActiveFilters = computed(() => {
    return Object.values(this.currentFilters()).some(
      (filter) => filter?.value !== null && filter?.value !== undefined && filter?.value !== '',
    );
  });

  // Configuración de la tabla
  tableConfig: TableConfig = {
    columns: [
      {
        field: 'last_name',
        header: 'Apellidos',
        sortable: true,
        filterable: true,
        filterType: 'text',
        filterMatchMode: 'contains',
      },

      {
        field: 'first_name',
        header: 'Nombre',
        sortable: true,
        filterable: true,
        filterType: 'text',
        filterMatchMode: 'contains',
      },
      {
        field: 'curp',
        header: 'CURP',
        sortable: true,
        filterable: true,
        filterType: 'text',
        filterMatchMode: 'contains',
      },

      {
        field: 'semestre_numero',
        header: 'Semestre',
        sortable: true,
        filterable: true,
        filterType: 'text',
        filterMatchMode: 'contains',
      },
      {
        field: 'numero_control',
        header: 'Número Control',
        sortable: true,
        filterable: true,
        filterType: 'text',
        filterMatchMode: 'contains',
      },
    ],
    globalFilterFields: ['apellidos'],
    rowsPerPageOptions: [5, 10, 25, 50],
    defaultRows: 10,
    showCurrentPageReport: true,
    currentPageReportTemplate: 'Mostrando {first} a {last} de {totalRecords} estudiantes',
    tableStyle: { 'min-width': '50rem', 'text-align': 'center' },
    sortField: 'apellidos',
    sortOrder: 1,
    actions: {
      edit: true,
      delete: true,
      view: true,
    },
  };

  /**
   * Carga los estudiantes con los filtros actuales
   * @param event Evento de lazy load
   * @param successMessage Mensaje opcional para mostrar después de carga exitosa
   */
  loadStudents(event?: TableLazyLoadEvent, successMessage?: string): void {
    // Actualizar signals con el estado del evento
    if (event) {
      this.updateStateFromEvent(event);
    }

    this.loading.set(true);

    this.studentService.getStudents(this.queryParams()).subscribe({
      next: (data) => {
        this.students.set(
          data.results.map((est: any) => ({
            ...est,
            //semestre_actual__numero: est.semestre_numero.numero,
          })) || [],
        );
        // Asegurar que totalRecords sea un número
        const total = data.count || data.total || 0;
        this.totalRecords.set(typeof total === 'number' ? total : 0);
        this.loading.set(false);

        // Mostrar mensaje de éxito si se proporcionó
        if (successMessage) {
          this.toastService.showSuccessToast(successMessage);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.totalRecords.set(0); // Reset en caso de error
        this.handleError(error);
      },
    });
  }

  /**
   * Actualiza el estado interno a partir de un evento de lazy load
   */
  private updateStateFromEvent(event: TableLazyLoadEvent): void {
    // Actualizar página
    if (event.first !== undefined && event.rows) {
      const newPage = Math.floor(event.first / event.rows);
      this.currentPage.set(newPage);
      this.pageSize.set(event.rows);
    }

    // Actualizar ordenamiento
    if (event.sortField) {
      this.currentSortField.set(event.sortField as string);
      this.currentSortOrder.set(event.sortOrder || 1);
    }

    // Actualizar filtros - solo los que tienen valor
    if (event.filters) {
      const activeFilters: FiltersState = {};

      Object.entries(event.filters).forEach(([key, filterValue]) => {
        // Verificar si es un filtro con valor
        if (filterValue && typeof filterValue === 'object') {
          // Manejar el caso de filtro simple
          const filter = filterValue as any;
          if (filter.value !== null && filter.value !== undefined && filter.value !== '') {
            activeFilters[key] = {
              value: filter.value,
              matchMode: filter.matchMode || 'contains',
            };
          }
        }
      });

      this.currentFilters.set(activeFilters);
    }
  }

  /**
   * Recarga los datos manteniendo los filtros actuales
   * pero volviendo a la primera página
   * @param successMessage Mensaje opcional para mostrar después de la recarga
   */
  reloadWithCurrentFilters(successMessage?: string): void {
    const reloadEvent: TableLazyLoadEvent = {
      first: 0, // Volver a primera página
      rows: this.pageSize(),
      sortField: this.currentSortField(),
      sortOrder: this.currentSortOrder(),
      filters: this.currentFilters(),
    };

    // Pasar el mensaje al loadStudents
    this.loadStudents(reloadEvent, successMessage);
  }

  /**
   * Agrega un nuevo estudiante
   */
  addStudent(): void {
    this.ref = this.dialogService.open(EditAddStudent, {
      header: 'Adicionar Estudiante',
      modal: true,
      closable: true,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    if (this.ref) {
      this.ref.onClose.subscribe((formResponse: any) => {
        if (formResponse) {
          this.studentService.createStudent(formResponse).subscribe({
            next: () => {
              // Recargar datos después de crear y mostrar mensaje
              this.reloadWithCurrentFilters('Estudiante creado exitosamente');
            },
            error: (error) => this.handleError(error),
          });
        }
      });
    }
  }

  /**
   * Edita un estudiante existente
   */
  onEditStudent(data: any): void {
    this.ref = this.dialogService.open(EditAddStudent, {
      header: 'Editar Estudiante',
      modal: true,
      closable: true,
      width: '70%',
      data,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    if (this.ref) {
      this.ref.onClose.subscribe((formResponse: any) => {
        if (formResponse) {
          this.studentService.updateStudent(data.id, formResponse).subscribe({
            next: () => {
              // Recargar datos después de editar y mostrar mensaje
              this.reloadWithCurrentFilters('Estudiante actualizado exitosamente');
            },
            error: (error) => this.handleError(error),
          });
        }
      });
    }
  }

  onViewStudent(event: any) {
    console.log('even', event);
    this.loading.set(true);
    this.authService
      .resetUserPassword(event.id)
      .pipe(
        tap((v) => {
          this.loading.set(false);
          console.log('cambio de clave', v);
          this.toastService.showSuccessToast('Se ha rieniciado la clave.');
        }),
        catchError(() => {
          this.loading.set(false);
          this.toastService.showErrorToastGeneric();
          return of(null);
        }),
      )
      .subscribe();
    /**curp
: 
"PEGJ900515HDFRRN00"
first_name
: 
"Flor"
id
: 
2
last_name
: 
"Colunga"
numero_control
: 
"12345678901222"
semestre_actual
: 
1
semestre_numero
: 
10
user_type
: 
"student" */
  }

  /**
   * Elimina un estudiante
   */
  onDeleteStudent(data: any): void {
    this.confirmationService.confirm({
      message: '¿Desea eliminar este estudiante?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
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
        this.studentService.deleteStudent(data.id).subscribe({
          next: () => {
            // Verificar si después de eliminar aún hay registros en la página actual
            const currentDataLength = this.students().length;

            if (currentDataLength === 1 && this.currentPage() > 0) {
              // Si era el último registro de la página y no es la primera página,
              // retroceder una página
              const previousPage = this.currentPage() - 1;
              this.currentPage.set(previousPage);
            }

            // Recargar datos después de eliminar y mostrar mensaje
            this.reloadWithCurrentFilters('Estudiante eliminado exitosamente');
          },
          error: (error) => this.handleError(error),
        });
      },
    });
  }

  /**
   * Obtiene un resumen de los filtros activos para mostrar
   */
  getActiveFiltersSummary(): string {
    const filters = this.currentFilters();
    return Object.entries(filters)
      .map(([key, filter]) => `${key}: ${filter.value}`)
      .join(', ');
  }

  /**
   * Maneja errores de las peticiones HTTP
   */
  private handleError(error: any): void {
    if (error.status !== 0 && error.status !== 401) {
      if (error?.error?.hasOwnProperty('error')) {
        this.toastService.showErrorToast(error.error.error);
      } else {
        this.toastService.showErrorToastGeneric();
      }
    }
  }
}
