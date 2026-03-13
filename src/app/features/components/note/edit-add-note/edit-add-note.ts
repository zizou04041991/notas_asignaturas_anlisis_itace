import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { SubjectItaceService } from '../../subject-itace/services/subject_itace_service';
import { StudentService } from '../../student/services/student_service';
import { forkJoin, map } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';
import { TcpService } from '../../tcp/services/tcp_service';

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
  SUBJECTS: { id: number; numero: number }[] = [];
  TCPS: { id: number; numero: number }[] = [];
  STUDENTS: { id: number; nombre_completo: string }[] = [];
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
      estudiante_id: new FormControl(
        {
          value: this.config?.data ? this.config?.data?.estudiante?.id : '',
          disabled: this.config?.data,
        },
        Validators.required,
      ),
      asignatura_id: new FormControl(
        this.config?.data ? this.config?.data?.asignatura?.id : '',
        Validators.required,
      ),
      nota: new FormControl(this.config?.data ? this.config?.data?.nota : '', [Validators.required, Validators.min(1)]),
      tcp_id: new FormControl(this.config?.data ? this.config?.data?.tcp.id : '', Validators.required),
    });
  }

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      students: this.studentService.getStudents(),
      subjects: this.subjectItaceService.getSubjectItaces(),
      tcps: this.tcpService.getTcps()
    })
      .pipe(
        map(({ students, subjects,tcps }) => {
          this.STUDENTS = students;
          this.SUBJECTS = subjects;
          this.TCPS = tcps;
          this.loading = false;
          this.cd.detectChanges();
          return {
            students,
            subjects,
          };
        }),
      )
      .subscribe({
        next: (report) => {
        },
        error: (err) => {
          this.loading = false;
        },
      });
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
