import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ex-datatable',
  templateUrl: './ex-datatable.component.html',
  styleUrls: ['./ex-datatable.component.scss'],
})
export class ExDatatableComponent implements OnInit {
  cellStyle: string = 'ex-cell-default';

  constructor() {}

  onCellDoubleClick() {
    this.cellStyle = 'ex-cell-edit';
  }

  onCellBlur() {
    this.cellStyle = 'ex-cell-default';
  }

  onCellFocus() {}

  ngOnInit(): void {}
}
