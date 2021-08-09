import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NpdRoutingModule } from './npd-routing.module';
import { NpdComponent } from './npd.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [NpdComponent],
  imports: [
    CommonModule,
    NpdRoutingModule,
    SharedModule
  ],
  exports: [NpdComponent]

})
export class NpdModule { }
