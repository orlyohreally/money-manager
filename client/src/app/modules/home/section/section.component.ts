import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'home-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
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

  // private animateElementQuerySelector(selector) {
  //   this.el.nativeElement.querySelector(selector).classList.add('animated');
  // }
}
