import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RawMaterialInventoryRoutingModule } from './raw-material-inventory-routing.module';
import { RawMaterialInventoryComponent } from './raw-material-inventory.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [RawMaterialInventoryComponent],
  imports: [
    CommonModule,
    RawMaterialInventoryRoutingModule,
    SharedModule
  ]
})
export class RawMaterialInventoryModule { }
