import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// tslint:disable-next-line: max-line-length
import { TermsAndConditionsRoutingModule } from './terms-and-conditions-routing.module';
// tslint:disable-next-line: max-line-length
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

@NgModule({
  declarations: [TermsAndConditionsComponent],
  imports: [CommonModule, TermsAndConditionsRoutingModule]
})
export class TermsAndConditionsModule {}
