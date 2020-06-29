import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class SupportService extends DataService {
  private apiUrl = 'support/contact';

  constructor(
    globalVariablesService: GlobalVariablesService,
    http: HttpClient
  ) {
    super(http, globalVariablesService);
  }

  contactSupport(data: {
    email: string;
    subject: string;
    message: string;
  }): Observable<{ message: string }> {
    return this.post(this.apiUrl, data);
  }
}
