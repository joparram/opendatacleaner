import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Pagination } from '../models/pagination';
import { PaginatedData } from '../models/paginateddata';

const baseURL = 'http://localhost:5000/paginated_data';

@Injectable({
  providedIn: 'root',
})
export class PaginatedDataService {
  private datasource = new Subject<any>();
  private columnssource = new Subject<any>();
  private typessource = new Subject<any>();
  private fulldata = new Subject<any>();

  data$ = this.datasource.asObservable();
  columns$ = this.columnssource.asObservable();
  types$ = this.typessource.asObservable();
  fulldata$ =this.fulldata.asObservable();

  constructor(private httpClient: HttpClient) {}

  updateDataEvents(e: any): void {
    this.datasource.next(e.data);
    this.columnssource.next(e.columns);
    this.typessource.next(e.types);
    this.fulldata.next(e);
  }

  get(pagination: Pagination): Observable<PaginatedData> {
    const params = new HttpParams()
      .set('startRow', JSON.stringify(pagination.startRow))
      .set('endRow', JSON.stringify(pagination.endRow));

    console.log(params.keys());
    return this.httpClient.get<PaginatedData>(baseURL, { params: params });
  }
}
