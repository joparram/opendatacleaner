import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
import { map } from 'rxjs/operators';
const baseURL = 'http://localhost:5000/exporter';

@Injectable({
  providedIn: 'root',
})
export class ExporterService {
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
    // headers.append('Accept', 'text/csv');
    let _params = {} as any;
    _params.action = data.action;
    if (pagination !== undefined) {
      _params.startRow = JSON.stringify(pagination.startRow);
      _params.endRow = JSON.stringify(pagination.endRow);
    }
    if (data.plugin !== undefined) {
      _params.plugin = data.plugin;
    }
    params = new HttpParams({ fromObject: _params });
    delete data['action'];
    delete data['plugin'];

    for (var key in data) {
      var name = key;
      var value = data[key];
      formData.append(name, value);
    }

    return this.httpClient
      .post(baseURL, formData, { headers: headers, params: params, responseType: 'blob', observe: 'response' })
      .pipe(
        map((res: any) => {
          console.log(res.headers);
          let data = {
            file: res.body,
            filename: res.headers.get('File-Name'),
          };
          return data;
        })
      );
  }
}
