import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageComponent } from './page/page.component';
import { PagesRoutingModule } from './pages-routing.module';

import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [PagesComponent, PageComponent],
  imports: [CommonModule, PagesRoutingModule, SharedModule]
})
export class PagesModule {}
