import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../../../shared/shared.module';
import { PlotsComponent } from './plots.component';
import { PlotsRoutingModule } from './plots-routing.module';

@NgModule({
  declarations: [PlotsComponent],
  imports: [
    CommonModule,
    PlotsRoutingModule,
    SharedModule
  ]
})
export class PlotsModule { }
