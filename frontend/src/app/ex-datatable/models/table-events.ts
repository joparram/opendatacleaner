export interface EXTableEvents {
  getRows(params: EXTableEventsParams, callbacks: EXTableEventsCallbacks): void;

  onClickRow(row: any): void;
  onDoubleClickRow(row: any): void;
  onSelectRow(row: any): void;
  onEditRow(row: any): void;
  onDeleteRow(row: any): void;

  onClickColumn(column: any): void;
  onDoubleClickColumn(column: any): void;
  onSelectColumn(column: any): void;
  onEditColumn(column: any): void;
  onDeleteColumn(column: any): void;

  onClickCell(cell: any): void;
  onDoubleClickCell(cell: any): void;
  onSelectCell(cell: any): void;
  onEditCell(cell: any): void;

  onDestroy?(): void;
}

export interface EXTableEventsCallbacks {
  onSuccess(rows: any[]): void;
}

export interface EXTableEventsParams {
  page: number;
  blocksize: number;
  firstRow?: number;
  lastRow?: number;
  totalRows?: number;
  totalPages?: number;
}
