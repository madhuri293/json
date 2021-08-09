import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChemicalsUsedRoutingModule } from './chemicals-used-routing.module';
import { ChemicalsUsedComponent } from './chemicals-used.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [ChemicalsUsedComponent],
  imports: [
    CommonModule,
    ChemicalsUsedRoutingModule,
    SharedModule
  ]
})
export class ChemicalsUsedModule { }
