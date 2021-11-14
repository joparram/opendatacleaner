import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'ex-paginator',
  templateUrl: './ex-paginator.component.html',
  styleUrls: ['./ex-paginator.component.scss'],
})
export class ExPaginatorComponent implements OnInit {
  firstRow: number;

  page: number;

  pageChangeObserver: Observable<number>;

  lastRow: number = undefined;

  @Input() blockSize: number = 100;
  @Input() totalRows: number = undefined;
  @Input() totalPages: number = undefined;

  @Output() pageChange = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {
    this.initialize();
    this.pageChangeObserver = this.pageChange.asObservable();
    this.pageChangeObserver.subscribe((_) => {
      console.log('emitter');
      this.calcFirstLastRows();
    });
  }

  public initialize() {
    this.firstRow = 1;
    this.page = 1;
    this.lastRow = this.page * this.blockSize;
  }
  // Function that is called when any attribute is changed

  calcFirstLastRows(): void {
    this.lastRow = this.page * this.blockSize;
    this.firstRow = (this.page - 1) * this.blockSize + 1;
  }

  next(): void {
    if (this.totalPages !== undefined) {
      if (this.page < this.totalPages) {
        this.page++;
      }
    } else {
      this.page++;
    }
    this.pageChange.emit(this.page);
  }

  previous(): void {
    if (this.page > 1) {
      this.page--;
    }
    this.pageChange.emit(this.page);
  }

  first(): void {
    this.page = 1;
    this.pageChange.emit(this.page);
  }
  last(): void {
    if (this.totalPages !== undefined) {
      this.page = this.totalPages;
      this.pageChange.emit(this.page);
    }
  }
}
