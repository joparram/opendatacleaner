import { Component, Input, OnInit } from '@angular/core';
import { Header } from '../models/header';

@Component({
  selector: 'ex-datatable',
  templateUrl: './ex-datatable.component.html',
  styleUrls: ['./ex-datatable.component.scss'],
})
export class ExDatatableComponent implements OnInit {
  cellStyle: string = 'ex-cell-default';
  menu: boolean = false;
  @Input()
  headers: Header[] = [] as Header[];

  @Input()
  rows: any[] = [];

  constructor() {}

  onCellDoubleClick() {
    this.cellStyle = 'ex-cell-edit';
  }
  onMenuButtonClick() {
    this.menu = !this.menu;
  }
  onCellBlur() {
    this.cellStyle = 'ex-cell-default';
  }

  onCellFocus() {}

  ngOnInit(): void {}
}
