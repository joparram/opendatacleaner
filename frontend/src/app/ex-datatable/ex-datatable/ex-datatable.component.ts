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
import { EXTableEvents, Cell} from '../models/table-events';

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

  @Input() datasource: EXTableDatasource;
  @Output() onTableInit: EventEmitter<any> = new EventEmitter();

  datasourceParams: EXDatasourceParams = {
    page: 1,
    pageRows: 50,
    firstRow: 1,
    lastRow: 50,
  };

  @Input()
  events: EXTableEvents;

  @Input()
  headers: Header[] = [] as Header[];

  @Input()
  menuItems: any[] = [];

  @Input()
  rows: any[] = [];
  rowsReal: any[] = [];
  @ViewChild('paginator') paginator: any;

  constructor(private ref: ChangeDetectorRef) {}

  setDatasource(datasource: EXTableDatasource) {
    this.datasource = datasource;
  }

  ngOnInit(): void {
    this.onTableInit.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ref.detectChanges();
  }

  onCellFocus(cell : Cell) {
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

  onCellChanges(cell : Cell) {
    this.events?.onEditCell(cell);
  }

  onPagination() {
    setTimeout(() => {
      this.datasource.getRows(
        this.datasourceParams,
        (data: any) => {
          this.rowsReal = data;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }, 0);
  }

  buildCellFromEvent(value: any, x: number,  y: number) {
    const cell: Cell = {
      columnName: this.headers[y].field,
      value: value,
      x: x + 1,
      y: y + 1,
    }
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
