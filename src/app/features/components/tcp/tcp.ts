import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, signal, ViewChild } from '@angular/core';
import { ColumnConfig, Table } from '../../../shared/components/table/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, finalize } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';
import { TcpService } from './services/tcp_service';
import { EditAddTcp } from './edit-add-tcp/edit-add-tcp';

@Component({
  selector: 'app-tcp',
  imports: [CommonModule, ConfirmDialogModule, Table, InputNumberModule],
  templateUrl: './tcp.html',
  styleUrl: './tcp.css',
  providers: [DialogService, ConfirmationService],
})
export class TCP {
  private tcpService = inject(TcpService);
  toastrService = inject(ToastrService);

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
        this.tcpService.deleteTcp(id).subscribe(
          (value) => {
            this.loadSemester();
          },
          (error) => {},
        );
      },
      reject: () => {},
    });
  }

  ngOnInit() {
    this.loadSemester();
  }

  loadSemester() {
    this.loading.set(true);

    this.tcpService.getTcps().subscribe({
      next: (data) => {
        // Signals manejan automáticamente la detección de cambios
        this.semester.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toastrService.error('Error al cargar los semestres');
      },
    });
  }
  
  addSemester() {
    this.ref = this.dialogService.open(EditAddTcp, {
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
        this.tcpService.createTcp(formResponse).subscribe(
          (value) => {
            this.loadSemester();
          },
          (error) => {},
        );
      }
    });
  }

  onEditSemester(data: { id: number; numero: number }) {
    this.ref = this.dialogService.open(EditAddTcp, {
      header: 'Editar Asignatura',
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
        this.tcpService.updateTcp(data.id, formResponse).subscribe(
          (value) => {
            this.loadSemester();
          },
          (error) => {},
        );
      }
    });
  }

  onDeleteSemester(event: { id: number; numero: number }) {
    this.confirm(event.id);
  }
}
