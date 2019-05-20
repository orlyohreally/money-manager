import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef
} from "@angular/core";
import { HomePageSection } from "../home-page-section";

@Component({
  selector: "app-home-page-section",
  templateUrl: "./home-page-section.component.html",
  styleUrls: ["./home-page-section.component.scss"]
})
export class HomePageSectionComponent implements OnInit {
  @Input() section: HomePageSection;
  @Input() classes: string;
  @Output() clickAction = new EventEmitter();
  private animated = false;

  constructor(public el: ElementRef) {}

  @HostListener("window:scroll", ["$event"])
  checkScroll() {
    if (!this.animated) {
      var rect = this.el.nativeElement.getBoundingClientRect();
      const delta = 50;
      const visible =
        rect.bottom > 0 &&
        rect.top + delta < document.documentElement.clientHeight;
      if (visible) {
        this.animateSection();
      }
    }
  }

  ngOnInit() {}
  public onClick() {
    this.clickAction.emit(this.section.name);
  }

  private animateSection(): void {
    this.animateElementQuerySelector(".action-block");
    this.animateElementQuerySelector(".section-image");
    this.animated = true;
  }

  private animateElementQuerySelector(selector) {
    this.el.nativeElement.querySelector(selector).classList.add("animated");
  }
}
