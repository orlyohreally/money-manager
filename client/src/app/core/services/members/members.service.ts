import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, map, mergeMap, switchMap } from 'rxjs/operators';

import { FamilyMember, MemberPaymentPercentage, Roles } from '@shared/types';
import { User } from '@shared/types';
import { updateArrayElement } from '@src/app/modules/shared/functions';
import { MemberRole } from '@src/app/types';
import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';

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
    return this.members.asObservable().pipe(
      switchMap(members => {
        if (!members[familyId]) {
          return this.loadMembers(familyId).pipe(
            map(() => this.members.getValue()[familyId])
          );
        }
        return of(members[familyId]);
      })
    );
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
    memberInfo: { email: string; roles: string[] }
  ): Observable<FamilyMember> {
    return this.post(this.getMemberApi(familyId), memberInfo).pipe(
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

  userIsFamilyAdmin(userId: string, familyId: string): Observable<boolean> {
    return this.getMembers(familyId).pipe(
      first(),
      map(members => {
        const foundMembers = members.filter(member => member._id === userId);
        return foundMembers.length
          ? foundMembers[0].roles.indexOf(Roles.Admin) > -1
          : false;
      })
    );
  }

  getMemberIcon(
    user: FamilyMember,
    asImageBackground: boolean = false
  ): SafeResourceUrl {
    const icon = user.icon || this.defaultIcon;
    return asImageBackground ? `url(${icon})` : icon;
  }

  updateMembersPaymentPercentages(
    familyId: string,
    equalPercentages: boolean,
    percentages?: MemberPaymentPercentage[]
  ): Observable<void> {
    return (!equalPercentages
      ? this.put(`${this.getMemberApi(familyId)}/payment-percentages`, {
          familyId,
          percentages
        })
      : of(undefined)
    ).pipe(
      switchMap(() => {
        return this.getMembers(familyId).pipe(first());
      }),
      map(members => {
        let updatedMembers: FamilyMember[];
        if (!equalPercentages) {
          updatedMembers = members.map(member => {
            const foundPercentage = percentages.filter(
              percentage => percentage.userId === member._id
            )[0];
            if (!foundPercentage) {
              return member;
            }
            return {
              ...member,
              paymentPercentage: foundPercentage.paymentPercentage
            };
          });
        } else {
          updatedMembers = members.map(member => {
            return {
              ...member,
              paymentPercentage: 100 / members.length
            };
          });
        }
        this.members.next({
          ...this.members.getValue(),
          [familyId]: updatedMembers
        });
      })
    );
  }

  updateMember(userId: string, member: User | FamilyMember): void {
    const familyMembers = this.members.getValue();
    const updatedFamilyMembersList = Object.keys(familyMembers).reduce(
      (res, familyId) => {
        const members = updateArrayElement(familyMembers[familyId], {
          ...member,
          _id: userId
        });
        return { ...res, [familyId]: members };
      },
      {}
    );
    this.members.next(updatedFamilyMembersList);
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
