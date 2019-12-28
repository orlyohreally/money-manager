import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@shared/types';
import { BehaviorSubject, Observable } from 'rxjs';

export type Member = User & { roles: string[] };

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private members: BehaviorSubject<Member[]>;
  private dataStore: {
    members: Member[];
  };
  constructor(private http: HttpClient) {
    this.members = new BehaviorSubject([]);
    this.dataStore = { members: [] };
  }

  public loadMembers(familyId: string): Promise<BehaviorSubject<Member[]>> {
    return new Promise((resolve, reject) => {
      this.http.get(`/api/v1/families/${familyId}/members`).subscribe(
        (members: Member[]) => {
          this.dataStore.members = members;
          this.members.next(Object.assign({}, this.dataStore).members);
          resolve();
        },
        error => {
          reject(error);
        }
      );
    });
  }
  public async getMembers(familyId: string): Promise<Observable<Member[]>> {
    return this.loadMembers(familyId).then(() => {
      return this.members.asObservable();
    });
  }
  public getColorSchemes() {
    return ['primary', 'accent', 'purple'];
  }

  public getMemberFullName(member: Member) {
    return `${member.firstName} ${member.lastName}`;
  }
}
