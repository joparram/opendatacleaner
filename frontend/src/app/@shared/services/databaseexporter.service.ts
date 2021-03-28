import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';

const baseURL = 'http://localhost:5000/database_exporter';

@Injectable({
  providedIn: 'root',
})
export class DatabaseExporterService {
  constructor(private httpClient: HttpClient) {}

  get(): Observable<any> {
    return this.httpClient.get(baseURL);
  }

  post(data: any, pagination?: Pagination): Observable<any> {
    let formData: FormData = new FormData();
    let headers = new HttpHeaders();
    let params = new HttpParams();
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    if (pagination !== undefined) {
      params = new HttpParams()
        .set('startRow', JSON.stringify(pagination.startRow))
        .set('endRow', JSON.stringify(pagination.endRow))
        .set('action', data.action);
    } else {
      params = new HttpParams().set('action', data.action);
    }
    delete data['action'];
    for (var key in data) {
      var name = key;
      var value = data[key];
      formData.append(name, value);
    }

    return this.httpClient.post(baseURL, formData, { headers: headers, params: params });
  }
}
