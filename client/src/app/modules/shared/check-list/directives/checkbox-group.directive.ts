import { Directive } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'shared-checkbox-group',
  host: {
    class: 'shared-checkbox-group'
  }
})
export class CheckboxGroupDirective {}
