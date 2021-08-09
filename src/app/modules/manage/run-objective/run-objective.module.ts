import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RunObjectiveRoutingModule } from './run-objective-routing.module';
import { RunObjectiveComponent } from './run-objective.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [RunObjectiveComponent],
  imports: [
    CommonModule,
    RunObjectiveRoutingModule,
    SharedModule
  ]
})
export class RunObjectiveModule { }
