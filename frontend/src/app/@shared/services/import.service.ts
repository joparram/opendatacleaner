import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:4200/import';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private httpClient: HttpClient) { }

  get(): Observable<any> {
    return this.httpClient.get(baseURL);
  }

  post(data: any): Observable<any> {
    return this.httpClient.post(baseURL, data);
  }

}
