import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Header } from '../models/header';
import { EXDatasourceParams, EXTableDatasource } from '../models/table-data';
@Component({
  selector: 'ex-datatable',
  templateUrl: './ex-datatable.component.html',
  styleUrls: ['./ex-datatable.component.scss'],
})
export class ExDatatableComponent implements OnInit, OnChanges {
  cellStyle: string = 'ex-cell-default';

  @Input() datasource: EXTableDatasource;

  datasourceParams: EXDatasourceParams = {
    page: 1,
    pageRows: 50,
    firstRow: 1,
    lastRow: 50,
  };

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
    console.log('holaaaa');
    console.log(this.headers);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('holaaaa ngOnChanges');
    console.log(this.headers);
    this.ref.detectChanges();
  }
  onCellDoubleClick() {
    this.cellStyle = 'ex-cell-edit';
  }

  onCellBlur() {
    this.cellStyle = 'ex-cell-default';
  }

  onPagination() {
    this.datasource.getRows(
      this.datasourceParams,
      (data: any) => {
        this.rowsReal = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onCellFocus() {}
}
