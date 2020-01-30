import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
import { FamilyMember } from '@shared/types';
import { MemberRole } from '@src/app/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'family-members',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.scss']
})
export class FamilyMembersComponent implements OnInit {
  members: Observable<{ fullName: string; roles: string[]; icon: string }[]>;
  roles: Observable<{ [roleName: string]: MemberRole }>;

  constructor(
    private route: ActivatedRoute,
    private membersService: MembersService,
    private userManagerService: UserManagerService
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      const familyId = params.familyId;
      this.members = this.membersService.getMembers(familyId).pipe(
        map((members: FamilyMember[]) => {
          return members.map(
            member => ({
              fullName: this.userManagerService.getFullName(member),
              roles: member.roles,
              icon: this.userManagerService.getUserIcon(member) as string
            }),
            []
          );
        })
      );
      this.roles = this.membersService.getRoles(familyId).pipe(
        map((roles: MemberRole[]) => {
          return roles.reduce(
            (res, role: MemberRole) => ({ ...res, [role.name]: role }),
            {}
          );
        })
      );
    });
  }
}
