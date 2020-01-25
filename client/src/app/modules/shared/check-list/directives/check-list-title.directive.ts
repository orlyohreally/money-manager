import { Directive } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'shared-check-list-title',
  host: {
    class: 'shared-check-list-title'
  }
})
export class CheckListTitleDirective {
  constructor() {}
}
