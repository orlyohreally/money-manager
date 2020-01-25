import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FamilyMember, User } from '@shared/types';
import { MemberRole } from '@src/app/types';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';

export type Member = User & { roles: string[] };

@Injectable({
  providedIn: 'root'
})
export class MembersService extends DataService {
  private members: BehaviorSubject<Member[]>;
  private dataStore: {
    members: Member[];
  };

  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService
  ) {
    super(http, globalVariablesService);
    this.members = new BehaviorSubject([]);
    this.dataStore = { members: [] };
  }

  getMembers(familyId: string): Observable<Member[]> {
    return this.loadMembers(familyId).pipe(
      switchMap(() => {
        return this.members.asObservable();
      })
    );
  }

  addFamilyMember(
    familyId: string,
    member: Partial<Member>
  ): Observable<FamilyMember> {
    return this.post(this.getMemberApi(familyId), member).pipe(
      mergeMap((response: FamilyMember) => {
        return this.loadMembers(familyId).pipe(
          switchMap(() => {
            return of(response);
          })
        );
      })
    );
  }

  getRoles(familyId: string): Observable<MemberRole[]> {
    return this.get<{ roles: MemberRole[] }>(
      `${this.getMemberApi(familyId)}/roles`
    ).pipe(
      switchMap((response: { roles: MemberRole[] }) => of(response.roles))
    );
  }

  private loadMembers(familyId: string): Observable<Member[]> {
    return this.get(this.getMemberApi(familyId)).pipe(
      map((members: Member[]) => {
        this.dataStore.members = members;
        this.members.next(Object.assign({}, this.dataStore).members);
        return members;
      })
    );
  }
  private getMemberApi(familyId: string): string {
    return `families/${familyId}/members`;
  }
}
