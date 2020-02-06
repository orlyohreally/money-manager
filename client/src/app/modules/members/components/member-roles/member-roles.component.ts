import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MembersService } from '@src/app/core/services/members/members.service';
import { MemberRole } from '@src/app/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'member-member-roles',
  templateUrl: './member-roles.component.html',
  styleUrls: ['./member-roles.component.scss']
})
export class MemberRolesComponent implements OnInit {
  @Input() familyId: string;
  @Input() sectionTitle: string;

  @Output() rolesUpdated = new EventEmitter<string[]>();
  @Output() initialized = new EventEmitter<void>();

  roles: Observable<MemberRole[]>;

  private selectedRoles: { [name: string]: boolean } = {};

  constructor(private membersService: MembersService) {}

  ngOnInit() {
    this.roles = this.membersService.getRoles(this.familyId).pipe(
      map(roles => {
        this.initialized.emit();
        return roles;
      })
    );
  }

  onRoleChanged(role: MemberRole, change: boolean) {
    this.selectedRoles[role.name] = change;
    this.rolesUpdated.emit(
      Object.keys(this.selectedRoles).filter(
        (roleName: string) => this.selectedRoles[roleName]
      )
    );
  }
}
