import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Member, MembersService } from '../services/members/members.service';

@Component({
  selector: 'family-members',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.scss']
})
export class FamilyMembersComponent implements OnInit {
  public members: Observable<Member[]>;
  constructor(
    private route: ActivatedRoute,
    private membersService: MembersService
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.getMembers(params.familyId);
    });
  }

  private getMembers(familyId: string) {
    this.membersService.getMembers(familyId).then(members => {
      this.members = members;
    });
  }
}
