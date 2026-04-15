import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SemesterService } from '../../semester/services/semester_service';
import { SelectModule } from 'primeng/select';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'app-edit-admin',
  imports: [ReactiveFormsModule, ButtonModule, SelectModule, KeyFilterModule],
  templateUrl: './edit-add-admin.html',
  styleUrl: './edit-add-admin.css',
  providers: [DialogService],
})
export class EditAddAdmin {
  /**first_name
: 
"Diosdado"
id
: 
1
last_name
: 
"Castillo Marrero"
user_type
: 
"admin"
username
: 
"tito" */
  formAdmin!: FormGroup;
  submitted = false;
  semesterService = inject(SemesterService);
  cd = inject(ChangeDetectorRef);
  loading = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {
    console.log('datos', this.config?.data);
    this.formAdmin = new FormGroup({
      username: new FormControl(this.config?.data ? this.config?.data?.username : '', [
        Validators.required,
      ]),
      first_name: new FormControl(
        this.config?.data ? this.config?.data?.first_name : '',
        Validators.required,
      ),
      last_name: new FormControl(
        this.config?.data ? this.config?.data?.last_name : '',
        Validators.required,
      ),
    });
  }

  onCancel() {
    this.ref?.close();
  }

  onSave(): void {
    this.submitted = true;

    if (this.formAdmin.valid) {
      let saveData = this.formAdmin.getRawValue();
      console.log('saveData', saveData);
      if (this.config?.data === undefined || this.config?.data === null)
        saveData['password'] = saveData.username;
      this.ref?.close(saveData);
    } else {
      this.formAdmin.markAllAsTouched();
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.formAdmin.get(campo);
    if (!control) return false;

    if (this.submitted) {
      return control.invalid;
    }
    return control.invalid && control.touched;
  }
}
