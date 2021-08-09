import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SynthesizedMaterialInventoryManagementRoutingModule } from './synthesized-material-inventory-management-routing.module';
// tslint:disable-next-line:max-line-length
import { SynthesizedMaterialInventoryManagementComponent } from '../synthesized-material-inventory-management/synthesized-material-inventory-management.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [SynthesizedMaterialInventoryManagementComponent],
  imports: [
    CommonModule,
    SynthesizedMaterialInventoryManagementRoutingModule,
    SharedModule
  ]
})
export class SynthesizedMaterialInventoryManagementModule { }
