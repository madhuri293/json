import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapabilityRoutingModule } from './capability-routing.module';
import { CapabilityComponent } from './capability.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [CapabilityComponent],
  imports: [
    CommonModule,
    CapabilityRoutingModule,
    SharedModule
  ],
  exports: [CapabilityComponent]
})
export class CapabilityModule { }
