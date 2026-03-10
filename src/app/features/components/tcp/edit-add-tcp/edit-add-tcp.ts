import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialog,
  DynamicDialogConfig,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-edit-add-tcp',
  imports: [ReactiveFormsModule, ButtonModule, InputNumberModule],
  templateUrl: './edit-add-tcp.html',
  styleUrl: './edit-add-tcp.css',
  providers: [DialogService],
})
export class EditAddTcp {
  //instance: DynamicDialog | undefined;
  formSemester!: FormGroup;
  submitted = false;


  constructor(
    public ref: DynamicDialogRef,
    //private dialogService: DialogService,
    public config: DynamicDialogConfig,
  ) {
    //this.instance = this.dialogService.getInstance(this.ref);
    this.formSemester = new FormGroup({
      numero: new FormControl(
        this.config?.data ? this.config?.data?.numero : '',
        [Validators.required,Validators.min(1)]
      )
    });
  }

  onCancel() {
    this.ref?.close();
  }

  onSave(): void {
    this.submitted = true;
   
    if (this.formSemester.valid) {
      this.ref?.close(this.formSemester.getRawValue());
    } else {
      this.formSemester.markAllAsTouched();
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.formSemester.get(campo);
    if (!control) return false;

    if (this.submitted) {
      return control.invalid;
    }
    // Para otros campos
    return control.invalid && control.touched;
  }
}
