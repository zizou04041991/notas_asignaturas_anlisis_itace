import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SubjectItaceService } from './services/subject_itace_service';
import { SubjectItaceInterface } from './interface/subject_itace_interface';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditAddSubject } from './edit-add-subject/edit-add-subject';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastService } from '../../../shared/services/toast.service';


@Component({
  selector: 'app-subject-itace',
  imports: [
    TableModule,
    CommonModule,
    ColorPickerModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
  ],
  templateUrl: './subject-itace.html',
  styleUrl: './subject-itace.css',
  providers: [DialogService, ConfirmationService],
})
export class SubjectItace {
  private subjectItaceService = inject(SubjectItaceService);
  subjectiTaces!: SubjectItaceInterface[];
  loading: boolean = false;
  ref: DynamicDialogRef | undefined;
  toastService = inject(ToastService);

  private confirmationService = inject(ConfirmationService);

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
        this.subjectItaceService.deleteSubjectItace(id).subscribe(
          (value) => {
            this.loadSubject();
          },
          (error) => {
             if (error?.error.hasOwnProperty('error')) { 
              console.log()
              this.toastService.showErrorToast(error.error.error);
            }
            else{
              this.toastService.showErrorToastGeneric();
            }

          },
        );
      },
      reject: () => {},
    });
  }
  constructor(
    public dialogService: DialogService,
    public cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadSubject(true);
  }

  loadSubject(initial: boolean = false) {
    this.loading = true;
    this.subjectItaceService.getSubjectItaces().subscribe(
      (data) => {
        this.subjectiTaces = data;
        this.loading = false;
        this.cd.detectChanges();
        if(!initial) this.toastService.showSuccessToastGeneric();
      },
      (error) => {
        this.loading = false;
         if (error?.error.hasOwnProperty('error')) { 
              console.log()
              this.toastService.showErrorToast(error.error.error);
            }
            else{
              this.toastService.showErrorToastGeneric();
            }

      },
    );
  }

  edit(subjectData: SubjectItaceInterface) {
    this.ref = this.dialogService.open(EditAddSubject, {
      header: 'Editar Asignatura',
      modal: true,
      closable: true,
      focusOnShow: false,
      width: '70%',
      data: subjectData,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    }) as any;

    this.ref!.onClose.subscribe((formResponse: any) => {
      if (formResponse) {
        this.subjectItaceService.updateSubjectItace(subjectData.id, formResponse).subscribe(
          (value) => {
            this.loadSubject();
          },
          (error) => {
             if (error?.error.hasOwnProperty('error')) { 
              console.log()
              this.toastService.showErrorToast(error.error.error);
            }
            else{
              this.toastService.showErrorToastGeneric();
            }

          },
        );
      }
    });
  }
  delete(subjectData: SubjectItaceInterface) {
    this.confirm(subjectData.id);
  }

  show() {
    this.ref = this.dialogService.open(EditAddSubject, {
      header: 'Adicionar Asignatura',
      modal: true,
      closable: true,
      focusOnShow: false,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    }) as any;

    this.ref!.onClose.subscribe((formResponse: any) => {
      if (formResponse) {
        this.subjectItaceService.createSubjectItace(formResponse).subscribe(
          () => {
       
            this.loadSubject();
          },
          (error) => {
             if (error?.error.hasOwnProperty('error')) { 
              console.log()
              this.toastService.showErrorToast(error.error.error);
            }
            else{
              this.toastService.showErrorToastGeneric();
            }

          },
        );
      }
    });
  }
}
