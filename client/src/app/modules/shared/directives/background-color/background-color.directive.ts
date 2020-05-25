import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Inject
} from '@angular/core';

@Directive({
  selector: '[sharedBackgroundColor]'
})
export class BackgroundColorDirective implements AfterViewInit {
  @HostBinding('style.background-color') background: string;

  constructor(
    private el: ElementRef,
    @Inject('windowObj') private window: Window
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const dialog = this.el.nativeElement.closest('.mat-dialog-container');
      if (!!dialog) {
        this.background = this.getBackgroundColor(dialog);
        return;
      }
      this.background = this.getBackgroundColor(
        this.el.nativeElement.closest('.content')
      );
    });
  }

  private getBackgroundColor(el: Element): string {
    return this.window.getComputedStyle(el).backgroundColor;
  }
}
