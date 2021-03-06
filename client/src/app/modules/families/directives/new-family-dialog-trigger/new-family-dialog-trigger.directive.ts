import { Directive, HostListener } from '@angular/core';

import { DialogService } from '@core-client/services/dialog/dialog.service';
// tslint:disable-next-line: max-line-length
import { NewFamilyFormComponent } from '../../new-family-form/new-family-form.component';

@Directive({
  selector: '[familyNewFamily]'
})
export class NewFamilyDialogTriggerDirective {
  @HostListener('click', ['$event']) onClick() {
    this.newFamily();
  }

  constructor(private dialog: DialogService) {}

  newFamily() {
    this.dialog.open(NewFamilyFormComponent, {
      width: '60%',
      maxHeight: '80%',
      maxWidth: '700px',
      minWidth: '300px',
      restoreFocus: false
    });
  }
}
