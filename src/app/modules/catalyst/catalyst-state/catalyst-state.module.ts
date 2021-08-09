import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystStateRoutingModule } from './catalyst-state-routing.module';
import { CatalystStateComponent } from './catalyst-state.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [CatalystStateComponent],
  imports: [
    CommonModule, SharedModule,
    CatalystStateRoutingModule
  ]
})
export class CatalystStateModule { }
