import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StandardCutRangesRoutingModule } from './standard-cut-ranges-routing.module';
import { StandardCutRangesComponent } from './standard-cut-ranges.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [StandardCutRangesComponent],
  imports: [
    CommonModule,
    StandardCutRangesRoutingModule,
    SharedModule
  ]
})
export class StandardCutRangesModule { }
