import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModeRoutingModule } from './mode-routing.module';
import { ModeComponent } from './mode.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [ModeComponent],
  imports: [
    CommonModule,
    ModeRoutingModule,
    SharedModule
  ]
})
export class ModeModule { }
