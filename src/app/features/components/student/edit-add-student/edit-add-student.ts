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
    console.log('datos', this.config?.data);
    this.formStudent = new FormGroup({
      curp: new FormControl(this.config?.data ? this.config?.data?.curp : '', [
        Validators.required,
        Validators.pattern(/^.{18}$/),
      ]),
      first_name: new FormControl(
        this.config?.data ? this.config?.data?.first_name : '',
        Validators.required,
      ),
      last_name: new FormControl(
        this.config?.data ? this.config?.data?.last_name : '',
        Validators.required,
      ),

      semestre_actual: new FormControl(
        '',
        Validators.required,
      ),
      numero_control: new FormControl(this.config?.data ? this.config?.data?.numero_control : '', [
        Validators.required,
        Validators.pattern(/^.{14}$/),
      ]),
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.semesterService.getSemesters().subscribe(
      (value) => {
        this.SEMESTER = value.results;
        if (this.config?.data) {
          const semestreActualId = this.config?.data?.semestre_actual;
          const semestreEncontrado = this.SEMESTER.find((s) => s.id === semestreActualId);

          // Si existe, actualizamos el control con el objeto completo
          if (semestreEncontrado) {
            console.log('semestreEncontrado', semestreEncontrado);
            this.formStudent.patchValue({
              semestre_actual: semestreEncontrado.id, // debe tener { id, numero }
            });
          }
        }
        this.loading = false;
        //this.cd.detectChanges();
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  onCancel() {
    this.ref?.close();
  }

  onSave(): void {
    this.submitted = true;

    if (this.formStudent.valid) {
      let saveData = this.formStudent.getRawValue();
      console.log('saveData', saveData);
      if (this.config?.data === undefined || this.config?.data === null)
        saveData['password'] = saveData.numero_control;
      this.ref?.close(saveData);
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
