import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystScaleRoutingModule } from './catalyst-scale-routing.module';
import { CatalystScaleComponent } from './catalyst-scale.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [CatalystScaleComponent],
  imports: [
    CommonModule,
    CatalystScaleRoutingModule,
    SharedModule
  ]
})
export class CatalystScaleModule { }
