import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechnologyRoutingModule } from './technology-routing.module';
import { TechnologyComponent } from './technology.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [TechnologyComponent],
  imports: [
    CommonModule,
    SharedModule,
    TechnologyRoutingModule
  ]
})
export class TechnologyModule { }
