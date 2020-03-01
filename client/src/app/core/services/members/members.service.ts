import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FamilyMember, Roles } from '@shared/types';
import { User } from '@shared/types';
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
  private members: BehaviorSubject<{ [familyId: string]: FamilyMember[] }>;
  private defaultIcon = '/assets/images/profile.png';
  private memberRoles = new BehaviorSubject<{
    [familyId: string]: MemberRole[];
  }>({});

  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService
  ) {
    super(http, globalVariablesService);
    this.members = new BehaviorSubject({});
  }

  getMembers(familyId: string): Observable<FamilyMember[]> {
    if (!this.members.getValue()[familyId ? familyId : 'user']) {
      return this.loadMembers(familyId).pipe(
        switchMap(() => of(this.members.getValue()[familyId]))
      );
    }
    return of(this.members.getValue()[familyId]);
  }

  getFamilyMemberById(
    familyId: string,
    userId: string
  ): Observable<FamilyMember> {
    if (!this.members.getValue()[familyId]) {
      return this.loadMembers(familyId).pipe(
        map(() => this.findMember(userId, familyId))
      );
    }
    return of(this.findMember(userId, familyId));
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
    if (this.memberRoles.getValue()[familyId]) {
      return of(this.memberRoles.getValue()[familyId]);
    }
    return this.get<{ roles: MemberRole[] }>(
      `${this.getMemberApi(familyId)}/roles`
    ).pipe(
      switchMap((response: { roles: MemberRole[] }) => {
        this.memberRoles.next({
          ...this.memberRoles.getValue(),
          [familyId]: response.roles
        });
        return of(response.roles);
      })
    );
  }

  memberIsAdult(memberRoles: string[]) {
    return (
      memberRoles.indexOf(Roles.Adult) > -1 ||
      memberRoles.indexOf(Roles.Admin) > -1 ||
      memberRoles.indexOf(Roles.Owner) > -1
    );
  }

  familyMemberCanManageFamilyPayments(member: FamilyMember) {
    return (
      member.roles.indexOf(Roles.Child) > -1 ||
      member.roles.indexOf(Roles.Adult) > -1 ||
      member.roles.indexOf(Roles.Admin) > -1 ||
      member.roles.indexOf(Roles.Owner) > -1
    );
  }

  userIsFamilyAdmin(userId: string, familyId: string): Observable<boolean> {
    return this.getMembers(familyId).pipe(
      map(members => {
        const foundMembers = members.filter(member => member._id === userId);
        return foundMembers.length
          ? foundMembers[0].roles.indexOf(Roles.Admin) > -1
          : false;
      })
    );
  }

  getMemberIcon(user: FamilyMember): SafeResourceUrl {
    return user.icon || this.defaultIcon;
  }

  private loadMembers(familyId: string): Observable<FamilyMember[]> {
    return this.get(this.getMemberApi(familyId)).pipe(
      map((members: FamilyMember[]) => {
        this.members.next({ ...this.members.getValue(), [familyId]: members });
        return members;
      })
    );
  }

  private getMemberApi(familyId: string): string {
    return `families/${familyId}/members`;
  }

  private findMember(userId: string, familyId: string): FamilyMember {
    const foundMembers = this.members
      .getValue()
      [familyId].filter(member => member._id === userId);
    return foundMembers.length ? foundMembers[0] : null;
  }
}
