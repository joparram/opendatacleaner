export interface TableData {
  getRows(params: DataTableParams, callbacks: DataTableCallbacks): void;
  onDestroy?(): void;
}

export interface DataTableCallbacks {
  onSuccess(rows: any[]): void;
}

export interface DataTableParams {
  page: number;
  blocksize: number;
  firstRow?: number;
  lastRow?: number;
  totalRows?: number;
  totalPages?: number;
}
