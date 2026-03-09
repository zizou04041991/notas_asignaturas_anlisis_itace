import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

export interface ColumnConfig {
  field: string;
  header: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'currency' | 'custom';
  format?: string;
  template?: TemplateRef<any>; // Para personalizar el renderizado
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule],
 templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  // Datos principales
  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] = [];
  @Input() loading: boolean = false;
  @Input() totalRecords: number = 0;
  
  // Configuración de paginación
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];
  
  // Configuración de ordenamiento
  @Input() sortField: string = '';
  @Input() sortOrder: number = 1;
  
  // Configuración visual
  @Input() tableStyle: any = { 'min-width': '50rem' };
  @Input() scrollable: boolean = false;
  @Input() scrollHeight: string = '400px';
  
  // Configuración de filtros
  @Input() globalFilterFields: string[] = [];
  @Input() showGlobalFilter: boolean = false;
  @Input() showColumnFilters: boolean = false;
  @Input() searchPlaceholder: string = 'Buscar...';
  
  // Configuración de toolbar
  @Input() showToolbar: boolean = true;
  @Input() showAddButton: boolean = true;
  @Input() showExportButton: boolean = false;
  
  // Configuración de acciones
  @Input() showActions: boolean = true;
  @Input() showViewAction: boolean = true;
  @Input() showEditAction: boolean = true;
  @Input() showDeleteAction: boolean = true;
  
  // Selección de filas
  @Input() selectionMode: 'single' | 'multiple' | null = null;
  @Input() selection: any | any[] = null;
  
  // Eventos de salida
  @Output() onAdd = new EventEmitter<void>();
  @Output() onExport = new EventEmitter<void>();
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onPageChange = new EventEmitter<any>();
  @Output() onSortChange = new EventEmitter<any>();
  @Output() onFilterChange = new EventEmitter<any>();
  @Output() onSearchChange = new EventEmitter<string>();
  @Output() onColumnFilterChange = new EventEmitter<{field: string, value: string}>();
  @Output() selectionChange = new EventEmitter<any>();

  // Templates personalizados (opcional)
  @ContentChild('customActions') customActionsTemplate?: TemplateRef<any>;


  onSearch(event: any): void {
    this.onSearchChange.emit(event.target.value);
  }

  onColumnFilter(event: any, field: string): void {
    this.onColumnFilterChange.emit({
      field: field,
      value: event.target.value
    });
  }
}