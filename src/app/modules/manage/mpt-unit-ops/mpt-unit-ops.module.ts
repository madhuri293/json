import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MPTUnitOpsRoutingModule } from './mpt-unit-ops-routing.module';
import { MPTUnitOpsComponent } from '../mpt-unit-ops/mpt-unit-ops.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [MPTUnitOpsComponent],
  imports: [
    CommonModule,
    MPTUnitOpsRoutingModule,
    SharedModule
  ]
})
export class MPTUnitOpsModule { }
