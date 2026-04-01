// Source - https://stackoverflow.com/a/78088316
// Posted by Sannu
// Retrieved 2026-03-11, License - CC BY-SA 4.0

import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  TOAST_KEY: string = 'global-toast';
  STICKY: boolean = true;

  constructor(private msgService: MessageService) {}

  async showSuccessToast(detail: string, summary: string = 'Éxito'): Promise<void> {
    this.showToast(summary, detail, 'success');
  }

   async showSuccessToastGeneric(): Promise<void> {
    this.showToast('Éxito', ' Se ha realizado la operación exitosamente.', 'success');
  }
 

  async showInfoToast( detail: string, summary: string='Info'): Promise<void> {
    this.showToast(summary, detail, 'info');
  }
  async showWarnToast( detail: string, summary: string = 'Advertencia'): Promise<void> {
    this.showToast(summary, detail, 'warn');
  }

  async showErrorToast(detail: string, summary: string = 'Error'): Promise<void> {
    this.showToast(summary, detail, 'error');
  }

  async showErrorToastGeneric(): Promise<void> {
    this.showToast('Error', 'Ha ocurrido un error por favor contactar al administrador', 'error');
  }

  

  async showToast(summary: string, detail: string, severity: string): Promise<void> {
    this.msgService.add({
      key: this.TOAST_KEY,
      severity: severity,
      summary: summary,
      detail: detail,
      life: 2000,
      //sticky: true
      //
    });
  }
}
