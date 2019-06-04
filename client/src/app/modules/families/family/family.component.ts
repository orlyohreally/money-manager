import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { FamiliesService } from "../services/families/families.service";

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
      const familyId = params.get("familyId");
      this.getFamily(familyId);
    });
  }

  private getFamily(familyId: string): void {
    this.family = null;
    this.familiesService.getFamily(familyId).subscribe(
      family => {
        this.family = family;
        console.log(this.family);
      },
      error => {
        console.log(error);
      }
    );
  }

  public getMembersCountText(): string {
    return `${this.family.membersCount} ${
      this.family.membersCount === 1 ? "member" : "members"
    }`;
  }

  public getAvatarStyles(): { [property: string]: string } {
    return { "background-image": `url(${this.family.icon})` };
  }
}
