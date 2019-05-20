import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home-page-registration-banner",
  templateUrl: "./home-page-registration-banner.component.html",
  styleUrls: ["./home-page-registration-banner.component.scss"]
})
export class HomePageRegistrationBannerComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  public relocateToRegisterPage() {
    this.router.navigate(["/register"]);
    console.log("not implemented yet");
  }
}
