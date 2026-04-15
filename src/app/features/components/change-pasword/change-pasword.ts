import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { LoginAuth } from '../../../auth/services/login-auth';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-change-pasword',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, PasswordModule, CardModule],
  templateUrl: './change-pasword.html',
  styleUrl: './change-pasword.css',
})
export class ChangePasword {
  private fb = inject(FormBuilder);
  private authService = inject(LoginAuth);
  private toastService = inject(ToastService);

  passwordForm: FormGroup;
  submitted = false;
  loading = false;

  constructor() {
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  // Getter para acceder fácilmente a los controles
  get f() {
    return this.passwordForm.controls;
  }

  // Validador personalizado: comparar newPassword y confirmPassword
  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;

    if (this.passwordForm.invalid) {
      return;
    }

    this.loading = true;
    const { oldPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword(oldPassword, newPassword).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast(
          response.message || 'Contraseña actualizada correctamente',
        );
        this.passwordForm.reset();
        this.submitted = false;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        let errorMsg = 'Error al cambiar la contraseña';
        if (error.status === 400 && error.error) {
          if (error.error.old_password) {
            errorMsg = error.error.old_password[0];
          } else if (error.error.new_password) {
            errorMsg = error.error.new_password[0];
          } else if (error.error.non_field_errors) {
            errorMsg = error.error.non_field_errors[0];
          }
        }
        this.toastService.showErrorToast(errorMsg);
      },
    });
  }

  cancel() {
    this.passwordForm.reset();
    this.submitted = false;
    // Opcional: redirigir a otra página
    // this.router.navigate(['/']);
  }
}
