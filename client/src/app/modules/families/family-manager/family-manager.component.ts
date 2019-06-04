import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import {
  FamiliesService,
  MemberFamily
} from "../services/families/families.service";

@Component({
  selector: "family-family-manager",
  templateUrl: "./family-manager.component.html",
  styleUrls: ["./family-manager.component.scss"]
})
export class FamilyManagerComponent implements OnInit {
  public families: Observable<MemberFamily[]>;
  constructor(private familiesService: FamiliesService) {}

  ngOnInit() {
    this.families = this.familiesService.membersFamilies;
  }
}
