import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from './global-variables/global-variables.service';

@Injectable()
export class DataService {
  private readonly apiURL = this.globalVariablesService.apiURL;

  constructor(
    private http: HttpClient,
    private globalVariablesService: GlobalVariablesService
  ) {}

  protected get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(
      `${this.apiURL}/${url}`,
      params ? { params } : undefined
    );
  }

  protected post<T, S>(url: string, params: S): Observable<T>;
  protected post<T, S, W>(
    url: string,
    params: S,
    options: W
  ): Observable<HttpResponse<T>>;

  protected post<T, S, W = null>(
    url: string,
    params: S,
    options: W = null
  ): Observable<HttpResponse<T> | T> {
    return this.http.post<HttpResponse<T> | T>(
      `${this.apiURL}/${url}`,
      params,
      options ? options : undefined
    );
  }

  protected put<T, S>(url: string, params: S): Observable<T>;
  protected put<T, S, W = null>(
    url: string,
    params: S,
    options: W = null
  ): Observable<HttpResponse<T> | T> {
    return this.http.put<HttpResponse<T> | T>(
      `${this.apiURL}/${url}`,
      params,
      options ? options : undefined
    );
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.apiURL}/${url}`);
  }
}
