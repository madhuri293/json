import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystFamilyRoutingModule } from './catalyst-family-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { CatalystFamilyComponent } from './catalyst-family.component';

@NgModule({
  declarations: [CatalystFamilyComponent],
  imports: [
    CommonModule,
    CatalystFamilyRoutingModule,
    SharedModule
  ]
})
export class CatalystFamilyModule { }
