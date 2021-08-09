import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LIMSRoutingModule } from './lims-routing.module';
import { LIMSComponent } from './lims.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [LIMSComponent],
  imports: [
    CommonModule,
    LIMSRoutingModule,
    SharedModule
  ]
})
export class LIMSModule { }
