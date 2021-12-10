export interface EXTableEvents {
  onClickRow?(row: Row): void;
  onDoubleClickRow?(row: Row): void;
  onSelectRow?(row: Row): void;
  onEditRow?(row: Row): void;
  onDeleteRow?(row: Row): void;

  onClickColumn?(column: Column): void;
  onDoubleClickColumn?(column: Column): void;
  onSelectColumn?(column: Column): void;
  onEditColumn?(column: Column): void;
  onDeleteColumn?(column: Column): void;

  onFocusCell?(cell: Cell): void;
  onDoubleClickCell?(cell: Cell): void;
  onSelectCell?(cell: Cell): void;
  onEditCell?(cell: Cell): void;

  onDestroy?(): void;
}

export interface EXTableEventsCallbacks {
  onSuccess(rows: any[]): void;
}

export interface Row {
  value: any;
  x: number;
}

export interface Column {
  columnName: String;
  value: any;
  y: number;
}

export interface Cell {
  columnName: String;
  value: any;
  x: number;
  y: number;
}
