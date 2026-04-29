import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprobantesRoutingModule } from './comprobantes-routing-module';
import { ListComponent } from './pages/list/list';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComprobantesRoutingModule,
    ListComponent
  ]
})
export class ComprobantesModule { }