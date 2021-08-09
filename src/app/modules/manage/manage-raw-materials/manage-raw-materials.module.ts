import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRawMaterialsRoutingModule } from './manage-raw-materials-routing.module';
import { ManageRawMaterialsComponent } from './manage-raw-materials.component';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [ManageRawMaterialsComponent],
  imports: [
    CommonModule,
    ManageRawMaterialsRoutingModule,
    SharedModule
  ],

})
export class ManageRawMaterialsModule { }
