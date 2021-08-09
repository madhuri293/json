import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitOfMeasurementRoutingModule } from './unit-of-measurement-routing.module';
import { UnitOfMeasurementComponent } from './unit-of-measurement.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [UnitOfMeasurementComponent],
  imports: [
    CommonModule,
    UnitOfMeasurementRoutingModule,
    SharedModule
  ],
})
export class UnitOfMeasurementModule { }
