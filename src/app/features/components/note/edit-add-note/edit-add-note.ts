import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { SubjectItaceService } from '../../subject-itace/services/subject_itace_service';
import { StudentService } from '../../student/services/student_service';
import { catchError, forkJoin, map, of, finalize, tap } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';
import { TcpService } from '../../tcp/services/tcp_service';
import { LazyLoadEvent } from 'primeng/api';
import { APP_CONFIG } from '../../../../shared/constants/config-constants';

@Component({
  selector: 'app-edit-add-note',
  imports: [ReactiveFormsModule, ButtonModule, SelectModule, InputNumberModule],
  templateUrl: './edit-add-note.html',
  styleUrl: './edit-add-note.css',
  providers: [DialogService],
})
export class EditAddNote implements OnInit {
  formNote!: FormGroup;
  submitted = false;
  SUBJECTS: { id: number; nombre: string }[] = [];
  TCPS: { id: number; numero: number }[] = [];
  STUDENTS: { id: number; nombre_completo: string }[] = [];
  totalRecords: number = 0;
  subjectItaceService = inject(SubjectItaceService);
  studentService = inject(StudentService);
  tcpService = inject(TcpService);
  cd = inject(ChangeDetectorRef);
  loading = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {
    this.formNote = new FormGroup({
      estudiante: new FormControl(
        {
          value: this.config?.data ? this.config?.data?.estudiante : '',
          disabled: this.config?.data,
        },
        Validators.required,
      ),
      asignatura: new FormControl(
        this.config?.data ? this.config?.data?.asignatura : '',
        Validators.required,
      ),
      nota: new FormControl(this.config?.data ? this.config?.data?.nota : '', [
        Validators.required,
        Validators.min(1),
      ]),
      tcp: new FormControl(
        this.config?.data ? this.config?.data?.tcp_numero : '',
        Validators.required,
      ),
    });
  }

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      students: this.studentService.getStudents(),
      subjects: this.subjectItaceService.getSubjectItaces(),
      tcps: this.tcpService.getTcps(),
    })
      .pipe(
        map(({ students, subjects, tcps }) => {
          // Transformar estudiantes
          this.STUDENTS = students.results.map((est: any) => ({
            ...est,
            nombre_completo: `${est.last_name} ${est.first_name}`,
          }));
          // Asignar asignaturas y TCPs
          this.SUBJECTS = subjects.results;
          this.TCPS = tcps.results;
          this.totalRecords = subjects.total || 0;
          return { students, subjects, tcps };
        }),
        finalize(() => {
          this.loading = false;
          this.cd.markForCheck(); // ← Notifica a Angular sin forzar detección inmediata
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error cargando datos iniciales:', err);
          this.loading = false;
          this.cd.markForCheck();
        },
      });
  }

  loadItems(event: LazyLoadEvent) {
    this.loading = true;
    const page = Math.floor((event.first || 0) / APP_CONFIG.PAGE_SIZE) + 1;

    this.subjectItaceService
      .getSubjectItaces(`?page=${page}`)
      .pipe(
        tap((v) => {
          this.SUBJECTS = v.results;
          this.totalRecords = v.total;
          console.log('Asignaturas cargadas por paginación', v);
        }),
        finalize(() => {
          this.loading = false;
          this.cd.markForCheck();
        }),
        catchError((err) => {
          console.error('Error en carga paginada:', err);
          this.loading = false;
          this.cd.markForCheck();
          return of(null);
        })
      )
      .subscribe();
  }

  onCancel() {
    this.ref?.close();
  }

  onSave(): void {
    this.submitted = true;

    if (this.formNote.valid) {
      this.ref?.close(this.formNote.getRawValue());
    } else {
      this.formNote.markAllAsTouched();
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.formNote.get(campo);
    if (!control) return false;

    if (this.submitted) {
      return control.invalid;
    }
    return control.invalid && control.touched;
  }
}