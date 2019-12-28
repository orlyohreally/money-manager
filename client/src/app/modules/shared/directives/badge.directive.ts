import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[sharedBadge]'
})
export class BadgeDirective implements OnChanges {
  @Input() sharedBadge: string;

  private badgeEl: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (!this.badgeEl) {
      this.badgeEl = this.renderer.createElement('div');
      this.renderer.addClass(this.badgeEl, 'mm-badge');
      this.renderer.appendChild(this.el.nativeElement, this.badgeEl);
    }
    this.badgeEl.innerText = this.sharedBadge;
  }
}
