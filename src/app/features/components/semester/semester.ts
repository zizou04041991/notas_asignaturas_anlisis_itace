// semester.component.ts
import { Component, inject, signal, computed, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterService } from './services/semester_service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { EditAddSemester } from './edit-add-semester/edit-add-semester';
import { ToastService } from '../../../shared/services/toast.service';
import { TableLazyLoadEvent } from 'primeng/table';
import {
  FiltersState,
  ReusableTable,
  TableConfig,
} from '../../../shared/components/reusable-table/reusable-table';

@Component({
  selector: 'app-semester',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule, ReusableTable],
  templateUrl: './semester.html',
  styleUrl: './semester.css',
  providers: [DialogService, ConfirmationService],
})
export class Semester implements OnInit {
  private semesterService = inject(SemesterService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);

  @ViewChild(ReusableTable) reusableTable!: ReusableTable;

  ref: DynamicDialogRef | null = null;

  // Signals para datos
  semesters = signal<any[]>([]);
  loading = signal<boolean>(false);
  totalRecords = signal<number>(0);

  // Signals para el estado de la tabla
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  currentSortField = signal<string>('numero');
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
        field: 'numero',
        header: 'Semestre',
        sortable: true,
        filterable: true,
        filterType: 'text',
        filterMatchMode: 'contains',
        width: '70%',
      },
    ],
    globalFilterFields: ['numero'],
    rowsPerPageOptions: [5, 10, 25, 50],
    defaultRows: 10,
    showCurrentPageReport: true,
    currentPageReportTemplate: 'Mostrando {first} a {last} de {totalRecords} semestres',
    tableStyle: { 'min-width': '50rem' },
    sortField: 'numero',
    sortOrder: 1,
    actions: {
      edit: true,
      delete: true,
      view: false,
    },
  };

  ngOnInit() {
    // Cargar datos iniciales
    this.loadSemesters();
  }

  /**
   * Carga los semestres con los filtros actuales
   * @param event Evento de lazy load
   * @param successMessage Mensaje opcional para mostrar después de carga exitosa
   */
  loadSemesters(event?: TableLazyLoadEvent, successMessage?: string): void {
    // Actualizar signals con el estado del evento
    if (event) {
      this.updateStateFromEvent(event);
    }

    this.loading.set(true);

    this.semesterService.getSemesters(this.queryParams()).subscribe({
      next: (data) => {
        this.semesters.set(data.results);
        this.totalRecords.set(data.count || data.total);
        this.loading.set(false);
        
        // Mostrar mensaje de éxito si se proporcionó
        if (successMessage) {
          this.toastService.showSuccessToast(successMessage);
        }
      },
      error: (error) => {
        this.loading.set(false);
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

    // Pasar el mensaje al loadSemesters
    this.loadSemesters(reloadEvent, successMessage);
  }

  /**
   * Agrega un nuevo semestre
   */
  addSemester(): void {
    this.ref = this.dialogService.open(EditAddSemester, {
      header: 'Adicionar Semestre',
      modal: true,
      closable: true,
      width: '30%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    if (this.ref) {
      this.ref.onClose.subscribe((formResponse: any) => {
        if (formResponse) {
          this.semesterService.createSemester(formResponse).subscribe({
            next: () => {
              // Recargar datos después de crear y mostrar mensaje
              this.reloadWithCurrentFilters('Semestre creado exitosamente');
            },
            error: (error) => this.handleError(error),
          });
        }
      });
    }
  }

  /**
   * Edita un semestre existente
   */
  onEditSemester(data: any): void {
    this.ref = this.dialogService.open(EditAddSemester, {
      header: 'Editar Semestre',
      modal: true,
      closable: true,
      width: '30%',
      data,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    if (this.ref) {
      this.ref.onClose.subscribe((formResponse: any) => {
        if (formResponse) {
          this.semesterService.updateSemester(data.id, formResponse).subscribe({
            next: () => {
              // Recargar datos después de editar y mostrar mensaje
              this.reloadWithCurrentFilters('Semestre actualizado exitosamente');
            },
            error: (error) => this.handleError(error),
          });
        }
      });
    }
  }

  /**
   * Elimina un semestre
   */
  onDeleteSemester(data: any): void {
    this.confirmationService.confirm({
      message: '¿Desea eliminar este semestre?',
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
        this.semesterService.deleteSemester(data.id).subscribe({
          next: () => {
            // Verificar si después de eliminar aún hay registros en la página actual
            const currentDataLength = this.semesters().length;

            if (currentDataLength === 1 && this.currentPage() > 0) {
              // Si era el último registro de la página y no es la primera página,
              // retroceder una página
              const previousPage = this.currentPage() - 1;
              this.currentPage.set(previousPage);
            }

            // Recargar datos después de eliminar y mostrar mensaje
            this.reloadWithCurrentFilters('Semestre eliminado exitosamente');
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