import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef
} from "@angular/core";

@Component({
  selector: "app-home-page-section",
  templateUrl: "./section.component.html",
  styleUrls: ["./section.component.scss"]
})
export class SectionComponent implements OnInit {
  @Input() public title: string;
  @Input() public classes: string;
  @Input() public iconLink: string;
  @Input() public iconImagePath: string;
  @Input() public buttonLabel: string;
  @Input() public buttonClasses: string;

  @Output() public clickAction = new EventEmitter();

  public animated = false;

  constructor(public el: ElementRef) {}

  // @HostListener("window:scroll", ["$event"])
  // checkScroll() {
  //   if (!this.animated) {
  //     var rect = this.el.nativeElement.getBoundingClientRect();
  //     const delta = 50;
  //     const visible =
  //       rect.bottom > 0 &&
  //       rect.top + delta < document.documentElement.clientHeight;
  //     if (visible) {
  //       this.animateSection();
  //     }
  //   }
  // }

  ngOnInit() {}
  public onClick() {
    this.clickAction.emit();
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
