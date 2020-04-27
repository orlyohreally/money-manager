import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MembersService } from '@core-client/services/members/members.service';
import { FamilyMember } from '@shared/types';
import { MemberRole } from '@src/app/types';

@Component({
  selector: 'family-members',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.scss']
})
export class FamilyMembersComponent implements OnInit {
  members: Observable<FamilyMember[]>;
  roles: Observable<{ [roleName: string]: MemberRole }>;

  constructor(
    private route: ActivatedRoute,
    private membersService: MembersService
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      const familyId = params.familyId;
      this.members = this.membersService.getMembers(familyId);
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
