import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Header } from '../models/header';

@Component({
  selector: 'ex-datatable',
  templateUrl: './ex-datatable.component.html',
  styleUrls: ['./ex-datatable.component.scss'],
})
export class ExDatatableComponent implements OnInit {
  cellStyle: string = 'ex-cell-default';
  menu: number = null;
  @Input()
  headers: Header[] = [] as Header[];

  @Input()
  rows: any[] = [];

  constructor() {}

  onCellDoubleClick() {
    this.cellStyle = 'ex-cell-edit';
  }
  onMenuButtonClick(i: number) {
    if (this.menu == null) {
      this.menu = i;
    } else {
      this.menu = null;
    }
    console.log('menu: ' + this.menu);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target == document.getElementById('menu-btn'))) {
      //if its not within given parent > hide it this way or set boolean
      //variable that's bound to elements visibility property in template
      console.log(event.target);
      console.log(document.getElementById('menu-btn'));
      console.log('entraaa');
      this.menu = null;
    }
  }
  onCellBlur() {
    this.cellStyle = 'ex-cell-default';
  }

  onCellFocus() {}

  ngOnInit(): void {}
}
