import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { FamiliesService } from "../../shared/services/families/families.service";

@Component({
  selector: "app-family",
  templateUrl: "./family.component.html",
  styleUrls: ["./family.component.scss"]
})
export class FamilyComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private familiesService: FamiliesService
  ) {}
  family: { name: string; icon: string; membersCount: number };
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getFamily(params.get("familyId"));
    });
  }

  private getFamily(familyId: string): void {
    this.familiesService.getFamily(familyId).subscribe(
      family => {
        this.family = family;
      },
      error => {
        console.log(error);
      }
    );
  }
}
