import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialog,
  DynamicDialogConfig,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-edit-add-subject',
  imports: [ColorPickerModule, ReactiveFormsModule, FormsModule, ButtonModule],
  templateUrl: './edit-add-subject.html',
  styleUrl: './edit-add-subject.css',
  providers: [DialogService],
})
export class EditAddSubject {
  //instance: DynamicDialog | undefined;
  formSubject!: FormGroup;
  submitted = false;
  colorTouched: boolean = false;

  // Usar Set para campos con touched manual
  camposTocados = new Set<string>();

  constructor(
    public ref: DynamicDialogRef,
    //private dialogService: DialogService,
    public config: DynamicDialogConfig,
  ) {
    //this.instance = this.dialogService.getInstance(this.ref);
    this.formSubject = new FormGroup({
      nombre: new FormControl(
        this.config?.data ? this.config?.data?.nombre : '',
        Validators.required,
      ),
      color: new FormControl(
        this.config?.data ? this.config?.data?.color : '',
        Validators.required,
      ),
    });
  }

  onCancel() {
    this.ref?.close();
  }

  onSave(): void {
    this.submitted = true;
    this.camposTocados.add('color'); // Asegurar que el color se marca al guardar

    if (this.formSubject.valid) {
      this.ref?.close(this.formSubject.getRawValue());
    } else {
      this.formSubject.markAllAsTouched();
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.formSubject.get(campo);
    if (!control) return false;

    if (this.submitted) {
      return control.invalid;
    }

    // Para el color, usar el Set
    if (campo === 'color') {
      return control.invalid && control.touched && this.colorTouched;
    }

    // Para otros campos
    return control.invalid && control.touched;
  }

  hideColor() {
    this.colorTouched = true;
  }
}
