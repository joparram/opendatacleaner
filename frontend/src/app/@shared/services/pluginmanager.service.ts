import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
import { map } from "rxjs/operators";

const baseURL = 'http://localhost:5000/plugin_manager';

@Injectable({
  providedIn: 'root',
})
export class PluginmanagerService {

  private data = new BehaviorSubject<any>(
    {
      "processorPlugins": [],
      "exporterPlugins": [],
      "importerPlugins": [],
      "databaseExporterPlugins": [],
      "dataPlugins": []
    }
  );

  data$ = this.data.asObservable();

  constructor(private httpClient: HttpClient) {}

  get(): Observable<any> {
    return this.httpClient.get(baseURL);
  }

  getPlugins () {
    let headers = new HttpHeaders();
    let params = new HttpParams();

    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.httpClient.post(baseURL, { headers: headers, params: params }).pipe(map(response => {
      this.data.next(response)
      return response;
    }));
  }

  getTemplate (component: string) {
    let formData: FormData = new FormData();
    let headers = new HttpHeaders();
    let params = new HttpParams();

    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    let _params = {} as any;
    _params.action = 'downloadPluginTemplate'

    params = new HttpParams({ fromObject: _params });
    formData.append('component', component);

    return this.httpClient.post(baseURL, formData, { headers: headers, params: params, responseType: 'blob', observe: 'response' }).pipe(
      map((res: any) => {
        console.log(res);
        console.log(res.headers);
        let data = {
          file: res.body,
          filename: res.headers.get('File-Name'),
        };
        return data;
      })
    );
  }

  deletePlugin (component: any, pluginName: any): Observable<any> {
    let formData: FormData = new FormData();
    let headers = new HttpHeaders();
    let params = new HttpParams();

    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    let _params = {} as any;
    _params.action = "deletePlugin";

    params = new HttpParams({ fromObject: _params });

    formData.append("pluginName", pluginName);
    formData.append("component", component);

    return this.httpClient.post(baseURL, formData, { headers: headers, params: params }).pipe(map(response => {
      this.data.next(response)
      return response;
    }));
  }

  uploadPlugin (file: any): Observable<any> {
    let formData: FormData = new FormData();
    let headers = new HttpHeaders();
    let params = new HttpParams();

    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    let _params = {} as any;

    _params.action = "uploadPlugin";

    params = new HttpParams({ fromObject: _params });

    formData.append("plugin", file);

    return this.httpClient.post(baseURL, formData, { headers: headers, params: params }).pipe(map(response => {
      this.data.next(response)
      return response;
    }));
  }
  post(data: any): Observable<any> {
    let formData: FormData = new FormData();
    let headers = new HttpHeaders();
    let params = new HttpParams();

    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    let _params = {} as any;
    _params.action = data.action;

    params = new HttpParams({ fromObject: _params });
    delete data['action'];

    for (var key in data) {
      var name = key;
      var value = data[key];
      formData.append(name, value);
    }

    return this.httpClient.post(baseURL, formData, { headers: headers, params: params }).pipe(map(response => {
      this.data.next(response)
      return response;
    }));
  }
}
