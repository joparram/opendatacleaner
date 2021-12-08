import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Pagination } from '../models/pagination';
import { PaginatedData } from '../models/paginateddata';


@Injectable({
  providedIn: 'root',
})
export class AppLoaderService {
  private isLoading = new BehaviorSubject<boolean>(false);

  isLoading$ = this.isLoading.asObservable();


  constructor(private httpClient: HttpClient) {}

  startLoading() {
    if (!this.isLoading.getValue()) {
      this.isLoading.next(true);
    }
  }

  stopLoading() {
    if (this.isLoading.getValue()) {
      this.isLoading.next(false);
    }
  }

}
