import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageUnitOpsRoutingModule } from './manage-unit-ops-routing.module';
import { ManageUnitOpsComponent } from './manage-unit-ops.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [ManageUnitOpsComponent],
  imports: [
    CommonModule,
    ManageUnitOpsRoutingModule,
    SharedModule
  ]
})
export class ManageUnitOpsModule { }
