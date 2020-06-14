import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';

import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [HelpComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatDividerModule
  ],
  exports: [HelpComponent]
})
export class HelpModule {}
