import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystRoutingModule } from './catalyst-routing.module';
import { CatalystComponent } from './catalyst.component';

@NgModule({
  declarations: [CatalystComponent],
  imports: [
    CommonModule,
    CatalystRoutingModule
  ]
})
export class CatalystModule { }
