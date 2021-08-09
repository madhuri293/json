import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystMainMastersRoutingModule } from './catalyst-main-masters-routing.module';
import { CatalystMainMastersComponent } from './catalyst-main-masters.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [CatalystMainMastersComponent],
  imports: [
    CommonModule, SharedModule,
    CatalystMainMastersRoutingModule

  ]
})
export class CatalystMainMastersModule { }
