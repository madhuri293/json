import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystInventoryManagementRoutingModule } from './catalyst-inventory-management-routing.module';
import { CatalystInventoryManagementComponent } from './catalyst-inventory-management.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [CatalystInventoryManagementComponent],
  imports: [
    CommonModule,
    CatalystInventoryManagementRoutingModule,
    SharedModule
  ]
})
export class CatalystInventoryManagementModule { }
