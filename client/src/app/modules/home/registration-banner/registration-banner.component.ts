import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home-page-registration-banner",
  templateUrl: "./registration-banner.component.html",
  styleUrls: ["./registration-banner.component.scss"]
})
export class RegistrationBannerComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  public relocateToRegisterPage() {
    this.router.navigate(["/register"]);
    console.log("not implemented yet");
  }
}
