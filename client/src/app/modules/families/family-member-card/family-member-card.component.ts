import { Component, OnInit, Input } from "@angular/core";
import { Member } from "../services/members/members.service";

@Component({
  selector: "family-member-card",
  templateUrl: "./family-member-card.component.html",
  styleUrls: ["./family-member-card.component.scss"]
})
export class FamilyMemberCardComponent implements OnInit {
  @Input() member: Member;
  constructor() {}

  ngOnInit() {}
}
