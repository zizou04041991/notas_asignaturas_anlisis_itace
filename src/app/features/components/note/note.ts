import { ChangeDetectorRef, Component, computed, inject, signal, ViewChild } from '@angular/core';
import { NoteService } from './services/note_service';
import { NoteInterface } from './interface/note_interface';
import { CommonModule } from '@angular/common';
import { ColumnConfig, Table } from '../../../shared/components/table/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { EditAddNote } from './edit-add-note/edit-add-note';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-note',
  imports: [CommonModule, ConfirmDialogModule, Table, SelectModule],
  templateUrl: './note.html',
  styleUrl: './note.css',
  providers: [DialogService, ConfirmationService],
})
export class Note {
  private noteService = inject(NoteService);
  //notes!: NoteInterface[];
  /*loading: boolean = false;

  totalRecords: number = 0;*/

  @ViewChild(Table) tableComponent!: Table;

  // Configuración de columnas
  columns: ColumnConfig[] = [
    {
      field: 'estudiante_nombre_completo',
      header: 'Estudiante',
      width: '25%',
      sortable: false,
      filterable: true,
    },
    {
      field: 'asignatura_nombre',
      header: 'Asignatura',
      width: '25%',
      sortable: false,
      filterable: true,
    },
    {
      field: 'semestre_cursado_numero',
      header: 'Semestre',
      width: '25%',
      sortable: false,
      filterable: true,
    },
    {
      field: 'nota',
      header: 'Nota',
      width: '25%',
      sortable: false,
      filterable: true,
    },
  ];

  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  public cd = inject(ChangeDetectorRef);
  ref: DynamicDialogRef | undefined;

  notes = signal<NoteInterface[]>([]);
  loading = signal<boolean>(false);
  totalRecords = computed(() => this.notes().length);
  loadNotes() {
    this.loading.set(true);
    this.noteService.getNotes().subscribe(
      (data) => {
        this.notes.set(
          data.map((note: any) => ({
            ...note,
            estudiante_nombre_completo: note.estudiante?.nombre_completo,
            asignatura_nombre: note.asignatura.nombre,
            semestre_cursado_numero: note.semestre_cursado.numero,
          })),
        );
        this.loading.set(false);
      },
      (error) => {
        this.loading.set(false);
      },
    );
  }

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
        this.noteService.deleteNote(id).subscribe(
          (value) => {
            this.loadNotes();
          },
          (error) => {},
        );
      },
      reject: () => {},
    });
  }

  ngOnInit() {
    this.loadNotes();
  }

  onDeleteNote(event: any) {
    this.confirm(event.id);
  }
  addNote() {
    this.ref = this.dialogService.open(EditAddNote, {
      header: 'Adicionar Notas',
      modal: true,
      closable: true,
      focusOnShow: false,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    }) as any;

    this.ref!.onClose.subscribe((formResponse: any) => {
      if (formResponse) {
        this.noteService.createNote(formResponse).subscribe(
          (value) => {
            this.loadNotes();
          },
          (error) => {},
        );
      }
    });
  }

  onEditNote(data: { id: number; numero: number }) {
    this.ref = this.dialogService.open(EditAddNote, {
      header: 'Editar Notas',
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
        this.noteService.updateNote(data.id, formResponse).subscribe(
          (value) => {
            this.loadNotes();
          },
          (error) => {},
        );
      }
    });
  }
}
