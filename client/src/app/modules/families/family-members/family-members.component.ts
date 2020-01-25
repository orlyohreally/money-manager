import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Member,
  MembersService
} from '@core-client/services/members/members.service';
import { Observable } from 'rxjs';

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
      this.members = this.membersService.getMembers(params.familyId);
    });
  }
}
