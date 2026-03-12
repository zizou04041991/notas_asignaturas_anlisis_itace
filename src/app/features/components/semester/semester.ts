import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, signal, ViewChild } from '@angular/core';
import { SemesterService } from './services/semester_service';
import { ColumnConfig, Table } from '../../../shared/components/table/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { EditAddSemester } from './edit-add-semester/edit-add-semester';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-semester',
  imports: [CommonModule, ConfirmDialogModule, Table, InputNumberModule],
  templateUrl: './semester.html',
  styleUrl: './semester.css',
  providers: [DialogService, ConfirmationService],
})
export class Semester {
  private semesterService = inject(SemesterService);
  toastService = inject(ToastService);

  @ViewChild(Table) tableComponent!: Table;

  // Configuración de columnas
  columns: ColumnConfig[] = [
    {
      field: 'numero',
      header: 'Semestre',
      width: '25%',
      sortable: true,
      filterable: true,
    },
  ];

  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  public cd = inject(ChangeDetectorRef);
  ref: DynamicDialogRef | undefined;

  semester = signal<{ numero: number }[]>([]);
  loading = signal<boolean>(false);
  totalRecords = computed(() => this.semester().length);

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
        this.semesterService.deleteSemester(id).subscribe(
          (value) => {
            this.loadSemester();
          },
          (error) => {
            if (error.status !== 0 && error.status !== 401) {
              if (error?.error.hasOwnProperty('error')) {
                console.log();
                this.toastService.showErrorToast(error.error.error);
              } else {
                this.toastService.showErrorToastGeneric();
              }
            }
          },
        );
      },
      reject: () => {},
    });
  }

  ngOnInit() {
    this.loadSemester(true);
  }

  loadSemester(initial: boolean = false) {
    this.loading.set(true);

    this.semesterService.getSemesters().subscribe({
      next: (data) => {
        // Signals manejan automáticamente la detección de cambios
        this.semester.set(data);
        this.loading.set(false);
        if (!initial) this.toastService.showSuccessToastGeneric();
      },
      error: (error) => {
        this.loading.set(false);
        if (error.status !== 0 && error.status !== 401) {
          if (error?.error.hasOwnProperty('error')) {
            console.log();
            this.toastService.showErrorToast(error.error.error);
          } else {
            this.toastService.showErrorToastGeneric();
          }
        }
      },
    });
  }

  addSemester() {
    this.ref = this.dialogService.open(EditAddSemester, {
      header: 'Adicionar Semester',
      modal: true,
      closable: true,
      focusOnShow: false,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    }) as any;

    this.ref!.onClose.subscribe((formResponse: any) => {
      if (formResponse) {
        this.semesterService.createSemester(formResponse).subscribe(
          (value) => {
            this.loadSemester();
          },
          (error) => {
            if (error.status !== 0 && error.status !== 401) {
              if (error?.error.hasOwnProperty('error')) {
                console.log();
                this.toastService.showErrorToast(error.error.error);
              } else {
                this.toastService.showErrorToastGeneric();
              }
            }
          },
        );
      }
    });
  }

  onEditSemester(data: { id: number; numero: number }) {
    this.ref = this.dialogService.open(EditAddSemester, {
      header: 'Editar Semestre',
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
        this.semesterService.updateSemester(data.id, formResponse).subscribe(
          (value) => {
            this.loadSemester();
          },
          (error) => {
            if (error.status !== 0 && error.status !== 401) {
              if (error?.error.hasOwnProperty('error')) {
                console.log();
                this.toastService.showErrorToast(error.error.error);
              } else {
                this.toastService.showErrorToastGeneric();
              }
            }
          },
        );
      }
    });
  }

  onDeleteSemester(event: { id: number; numero: number }) {
    this.confirm(event.id);
  }
}
