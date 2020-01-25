import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemberRole } from '@src/app/types';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class UsersRolesService extends DataService {
  private readonly rolesApi = 'roles';
  constructor(
    globalVariablesService: GlobalVariablesService,
    http: HttpClient
  ) {
    super(http, globalVariablesService);
  }

  getRoles(): Observable<MemberRole[]> {
    return this.get<MemberRole[]>(this.rolesApi);
  }
}
