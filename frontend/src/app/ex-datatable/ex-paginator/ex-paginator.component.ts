import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { EXDatasourceParams } from '../models/table-data';

@Component({
  selector: 'ex-paginator',
  templateUrl: './ex-paginator.component.html',
  styleUrls: ['./ex-paginator.component.scss'],
})
export class ExPaginatorComponent implements OnInit {
  paginatorIndex: ExPaginatorIndex;
  paginatorIndexSubscription: Subscription;

  @Input() datasourceParams: EXDatasourceParams;
  @Output() datasourceParamsChange = new EventEmitter<EXDatasourceParams>();

  constructor() {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.paginatorIndex = new ExPaginatorIndex(this.datasourceParams?.totalPages);
    if (this.paginatorIndexSubscription) {
      this.paginatorIndexSubscription.unsubscribe();
    }
    this.paginatorIndexSubscription = this.paginatorIndex.page$.subscribe((page) => {
      if (this.datasourceParams) {
        this.datasourceParams.page = page;
        this.datasourceParams.lastRow = this.datasourceParams.page * this.datasourceParams.pageRows;
        this.datasourceParams.firstRow = (this.datasourceParams.page - 1) * this.datasourceParams.pageRows + 1;
        this.datasourceParamsChange.emit(this.datasourceParams);
      }
    });
  }
}

class ExPaginatorIndex {
  private page = new BehaviorSubject<number>(1);
  page$: Observable<number> = this.page.asObservable();
  totalPages: number;

  constructor(totalPages: number) {
    this.totalPages = totalPages;
  }

  public get(): number {
    return this.page.getValue();
  }

  public set(page: number): void {
    this.page.next(page);
  }

  public next(): void {
    let _page = this.page.getValue();
    if (this.totalPages !== undefined) {
      if (_page < this.totalPages) {
        _page++;
      }
    } else {
      _page++;
    }
    this.page.next(_page);
  }

  public previous(): void {
    let _page = this.page.getValue();
    if (_page > 1) {
      _page--;
    }
    this.page.next(_page);
  }

  public first(): void {
    this.page.next(1);
  }

  public last(): void {
    if (this.totalPages !== undefined) {
      this.page.next(this.totalPages);
    }
  }
}
