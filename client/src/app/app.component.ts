import { Component, OnInit } from "@angular/core";
import { MediaObserver } from "@angular/flex-layout";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(public media: MediaObserver) {}

  isOpened(): boolean {
    return !this.media.isActive("lt-sm");
  }
  
  getMode(): string {
    return this.media.isActive("lt-sm") ? "over" : "side";
  }
}
