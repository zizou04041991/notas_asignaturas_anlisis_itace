import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ContentChild, ViewChild, signal, computed, input } from '@angular/core';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'numeric' | 'date' | 'boolean';
  filterMatchMode?: string;
  width?: string;
  style?: any;
}

export interface TableConfig {
  columns: TableColumn[];
  globalFilterFields?: string[];
  rowsPerPageOptions?: number[];
  defaultRows?: number;
  showCurrentPageReport?: boolean;
  currentPageReportTemplate?: string;
  tableStyle?: { [key: string]: string };
  sortField?: string;
  sortOrder?: number;
  actions?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    custom?: boolean;
  };
}

export interface FilterValue {
  value: any;
  matchMode?: string;
}

export interface FiltersState {
  [key: string]: FilterValue;
}

@Component({
  selector: 'app-reusable-table',
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TooltipModule],
  templateUrl: './reusable-table.html',
  styleUrl: './reusable-table.css',
})
export class ReusableTable {
  // Input signals (requeridos)
  config = input.required<TableConfig>();
  data = input<any[]>([]);
  loading = input<boolean>(false);
  totalRecords = input<number>(0);
  first = input<number>(0);
  rows = input<number>(10);
  showActions = input<boolean>(true);
  
  // Outputs
  @Output() loadData = new EventEmitter<TableLazyLoadEvent>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  @Output() onCustomAction = new EventEmitter<{action: string, data: any}>();
  
  // ContentChild para templates personalizados
  @ContentChild('customActions') customActionsTemplate!: TemplateRef<any>;
  @ContentChild('customBody') customBodyTemplate!: TemplateRef<any>;
  @ContentChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  
  // ViewChild para la tabla
  @ViewChild('dt') table: any;

  // Signals locales
  rowsPerPageOptions = signal<number[]>([5, 10, 25, 50]);
  defaultSortField = signal<string>('');
  defaultSortOrder = signal<number>(1);

  // Computed signals para acceder a propiedades anidadas de forma segura
  hasViewAction = computed(() => this.config().actions?.view ?? false);
  hasEditAction = computed(() => this.config().actions?.edit ?? false);
  hasDeleteAction = computed(() => this.config().actions?.delete ?? false);
  hasCustomAction = computed(() => this.config().actions?.custom ?? false);
  
  hasFilterableColumns = computed(() => {
    return this.config().columns?.some(col => col.filterable) ?? false;
  });

  showCurrentPageReport = computed(() => {
    return this.config().showCurrentPageReport ?? true;
  });

  currentPageReportTemplate = computed(() => {
    return this.config().currentPageReportTemplate || 'Mostrando {first} a {last} de {totalRecords} entradas';
  });

  globalFilterFields = computed(() => {
    return this.config().globalFilterFields || [];
  });

  tableStyle = computed(() => {
    return this.config().tableStyle || { 'min-width': '50rem' };
  });

  // Computed signals para manejar valores por defecto y evitar NaN
  safeRows = computed(() => {
    const rowsValue = this.rows();
    return (rowsValue && typeof rowsValue === 'number' && !isNaN(rowsValue)) ? rowsValue : 10;
  });

  safeFirst = computed(() => {
    const firstValue = this.first();
    return (firstValue && typeof firstValue === 'number' && !isNaN(firstValue)) ? firstValue : 0;
  });

  safeTotalRecords = computed(() => {
    const total = this.totalRecords();
    return (total && typeof total === 'number' && !isNaN(total)) ? total : 0;
  });

  ngOnInit() {
    const currentConfig = this.config();
    
    if (currentConfig.rowsPerPageOptions) {
      this.rowsPerPageOptions.set(currentConfig.rowsPerPageOptions);
    }
    
    this.defaultSortField.set(currentConfig.sortField || '');
    this.defaultSortOrder.set(currentConfig.sortOrder || 1);
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.loadData.emit(event);
  }

  onEditClick(rowData: any) {
    this.onEdit.emit(rowData);
  }

  onDeleteClick(rowData: any) {
    this.onDelete.emit(rowData);
  }

  onViewClick(rowData: any) {
    this.onView.emit(rowData);
  }

  onCustomActionClick(action: string, rowData: any) {
    this.onCustomAction.emit({action, data: rowData});
  }

  clearFilters() {
    if (this.table) {
      this.table.clearFilters();
    }
  }

  resetTable() {
    if (this.table) {
      this.table.reset();
    }
  }

  getTotalColumns(): number {
    return (this.config().columns?.length || 0) + (this.showActions() ? 1 : 0);
  }
}
