import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-family",
  templateUrl: "./family.component.html",
  styleUrls: ["./family.component.scss"]
})
export class FamilyComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  familyName: string;
  ngOnInit() {
    this.familyName = this.route.snapshot.paramMap.get("familyName");
    console.log("family name", this.route.snapshot.paramMap.get("familyName"));
  }
}
