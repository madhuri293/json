import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystSizeRoutingModule } from './catalyst-size-routing.module';
import { CatalystSizeComponent } from './catalyst-size.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [CatalystSizeComponent],
  imports: [
    CommonModule,
    CatalystSizeRoutingModule,
    SharedModule
  ]
})
export class CatalystSizeModule { }
