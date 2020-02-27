import { Directive } from '@angular/core';

@Directive({
  selector: '[sharedScrollableContent]',
  host: {
    '[style.overflow]': '"auto"',
    '[style.width]': '"100%"'
  }
})
export class ScrollableContentDirective {
  constructor() {}
}
