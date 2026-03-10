import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SemesterService } from '../../semester/services/semester_service';
import { SelectModule } from 'primeng/select';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'app-edit-add-student',
  imports: [ReactiveFormsModule, ButtonModule, SelectModule, KeyFilterModule],
  templateUrl: './edit-add-student.html',
  styleUrl: './edit-add-student.css',
  providers: [DialogService],
})
export class EditAddStudent implements OnInit {
  formStudent!: FormGroup;
  submitted = false;
  SEMESTER: { id: number; numero: number }[] = [];
  semesterService = inject(SemesterService);
  cd = inject(ChangeDetectorRef);
  loading = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {
    this.formStudent = new FormGroup({
      curp: new FormControl(this.config?.data ? this.config?.data?.curp : '', Validators.required),
      nombre: new FormControl(
        this.config?.data ? this.config?.data?.nombre : '',
        Validators.required,
      ),
      apellidos: new FormControl(
        this.config?.data ? this.config?.data?.apellidos : '',
        Validators.required,
      ),
      semestre_id: new FormControl(
        this.config?.data ? this.config?.data?.semestre_actual?.id : '',
        Validators.required,
      ),
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.semesterService.getSemesters().subscribe(
      (value) => {
        this.SEMESTER = value;
        this.loading = false;
        this.cd.detectChanges();
      },
      (error) => {},
    );
  }

  onCancel() {
    this.ref?.close();
  }

  onSave(): void {
    this.submitted = true;

    if (this.formStudent.valid) {
      this.ref?.close(this.formStudent.getRawValue());
    } else {
      this.formStudent.markAllAsTouched();
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.formStudent.get(campo);
    if (!control) return false;

    if (this.submitted) {
      return control.invalid;
    }
    return control.invalid && control.touched;
  }
}
