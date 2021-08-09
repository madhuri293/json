import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LimsAnalysisMethodRoutingModule } from './lims-analysis-method-routing.module';
import { LimsAnalysisMethodComponent } from './lims-analysis-method.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [LimsAnalysisMethodComponent],
  imports: [
    CommonModule,
    LimsAnalysisMethodRoutingModule,
    SharedModule
  ]
})
export class LimsAnalysisMethodModule { }
