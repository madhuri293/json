import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiluentRoutingModule } from './diluent-routing.module';
import { DiluentComponent } from './diluent.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [DiluentComponent],
  imports: [
    CommonModule,
    DiluentRoutingModule,
    SharedModule
  ]
})
export class DiluentModule { }
