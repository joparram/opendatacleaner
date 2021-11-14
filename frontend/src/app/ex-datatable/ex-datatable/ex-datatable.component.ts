import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Header } from '../models/header';

@Component({
  selector: 'ex-datatable',
  templateUrl: './ex-datatable.component.html',
  styleUrls: ['./ex-datatable.component.scss'],
})
export class ExDatatableComponent implements OnInit {
  cellStyle: string = 'ex-cell-default';

  @Input()
  headers: Header[] = [] as Header[];

  @Input()
  rows: any[] = [];

  @Input()
  menuItems: any[] = [];

  @ViewChild('paginator') paginator: any;

  index: number = 0;

  constructor() {}

  onCellDoubleClick() {
    this.cellStyle = 'ex-cell-edit';
  }

  onCellBlur() {
    this.cellStyle = 'ex-cell-default';
  }

  onPageChange(event: any) {
    this.index = event.pageIndex;
    console.log('Se detecta en tabla');
  }

  onCellFocus() {}

  ngOnInit(): void {}
}
