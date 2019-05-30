import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Family } from "@shared/types";
import { FamiliesService } from "../../shared/services/families/families.service";

@Component({
  selector: "family-family-manager",
  templateUrl: "./family-manager.component.html",
  styleUrls: ["./family-manager.component.scss"]
})
export class FamilyManagerComponent implements OnInit {
  public families: Observable<Family[]>;
  constructor(private familiesService: FamiliesService) {}

  ngOnInit() {
    this.families = this.familiesService.membersFamilies;
  }
}
