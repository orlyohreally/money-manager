import { Directive, HostBinding, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[sharedColoredNumber]'
})
export class ColoredNumberDirective implements OnChanges {
  @HostBinding('style.color') colorClass: string;
  @Input() sharedColoredNumber: number;

  defaultPositiveColor = 'green';
  defaultNegativeColor = 'red';

  constructor() {}

  ngOnChanges(): void {
    this.colorClass =
      this.sharedColoredNumber >= 0
        ? this.defaultPositiveColor
        : this.defaultNegativeColor;
  }
}
