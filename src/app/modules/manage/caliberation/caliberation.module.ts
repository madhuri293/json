import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaliberationRoutingModule } from './caliberation-routing.module';
import { CaliberationComponent } from './caliberation.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [
    CaliberationComponent
  ],
  imports: [
    CommonModule, SharedModule ,
    CaliberationRoutingModule
  ]
})
export class CaliberationModule { }
