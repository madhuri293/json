import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhdRoutingModule } from './phd-routing.module';
import { PhdComponent } from './phd.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [PhdComponent],
  imports: [
    CommonModule,
    PhdRoutingModule,
    SharedModule
  ]
})
export class PhdModule { }
