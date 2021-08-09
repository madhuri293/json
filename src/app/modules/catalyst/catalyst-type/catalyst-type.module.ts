import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystTypeRoutingModule } from './catalyst-type-routing.module';
import { CatalystTypeComponent } from './catalyst-type.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [CatalystTypeComponent],
  imports: [
    CommonModule,
    CatalystTypeRoutingModule,
    SharedModule
  ]
})
export class CatalystTypeModule { }
