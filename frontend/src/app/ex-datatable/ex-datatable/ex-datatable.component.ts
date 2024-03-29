import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Header } from '../models/header';
import { EXDatasourceParams, EXTableDatasource } from '../models/table-data';
import { EXTableEvents, Cell } from '../models/table-events';

export enum KEY_CODE {
  ENTER = 'Enter',
}

@Component({
  selector: 'ex-datatable',
  templateUrl: './ex-datatable.component.html',
  styleUrls: ['./ex-datatable.component.scss'],
})
export class ExDatatableComponent implements OnInit, OnChanges {
  cellStyle: string = 'ex-cell-default';

  @Output() onTableInit: EventEmitter<EXDatasourceParams> = new EventEmitter<EXDatasourceParams>();

  datasourceParams: EXDatasourceParams = {
    page: 1,
    pageRows: 50,
    firstRow: 1,
    lastRow: 50,
    readyData: this.fillTable.bind(this),
    setDatasource: this.setDatasource.bind(this),
  };

  @Input()
  contextmenuItems: any[];

  @Input()
  events: EXTableEvents;

  @Input()
  menuItems: any[] = [];

  datasource: EXTableDatasource;
  rows: any[] = [];
  headers: Header[] = [] as Header[];

  @ViewChild('paginator') paginator: any;

  constructor(private ref: ChangeDetectorRef) {}

  setDatasource(datasource: EXTableDatasource) {
    this.datasource = datasource;
  }

  fillTable(rows: any, headers: Header[]) {
    this.headers = headers;
    this.rows = rows;
  }

  ngOnInit(): void {
    this.onTableInit.emit(this.datasourceParams);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ref.detectChanges();
  }

  onCellFocus(cell: Cell) {
    if (this.events?.onFocusCell) {
      this.events?.onFocusCell(cell);
    }
  }

  onCellDoubleClick() {
    this.cellStyle = 'ex-cell-edit';
  }

  onCellBlur() {
    this.cellStyle = 'ex-cell-default';
  }

  onCellChanges(cell: Cell) {
    this.events?.onEditCell(cell);
  }

  onPagination() {
    setTimeout(() => {
      this.datasource?.getData(this.datasourceParams);
    }, 0);
  }

  buildCellFromEvent(value: any, x: number, y: number) {
    const cell: Cell = {
      columnName: this.headers[y].field,
      value: value,
      x: x + (this.datasourceParams.page - 1) * this.datasourceParams.pageRows,
      y: y,
    };
    return cell;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KEY_CODE.ENTER) {
      let _event = event.target as any;
      if (_event?.tagName === 'INPUT') {
        _event?.blur();
        _event?.focus();
      }
    }
  }
}
