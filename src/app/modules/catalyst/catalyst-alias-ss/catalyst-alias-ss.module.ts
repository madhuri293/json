import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystAliasSsRoutingModule } from './catalyst-alias-ss-routing.module';
import { CatalystAliasSsComponent } from './catalyst-alias-ss.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [CatalystAliasSsComponent],
  imports: [
    CommonModule,
    CatalystAliasSsRoutingModule,
    SharedModule
  ]
})
export class CatalystAliasSsModule { }
