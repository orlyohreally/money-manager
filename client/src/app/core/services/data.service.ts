import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from './global-variables/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiURL = this.globalVariablesService.apiURL;

  constructor(
    private http: HttpClient,
    private globalVariablesService: GlobalVariablesService
  ) {}

  protected get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.apiURL}/${url}`);
  }

  protected post<T, S, W>(
    url: string,
    params: S,
    options: W = null
  ): Observable<HttpResponse<T>> {
    return this.http.post<HttpResponse<T>>(
      `${this.apiURL}/${url}`,
      params,
      options
    );
  }
}
