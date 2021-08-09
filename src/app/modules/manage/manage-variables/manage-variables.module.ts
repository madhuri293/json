import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageVariablesRoutingModule } from './manage-variables-routing.module';
import { ManageVariablesComponent } from './manage-variables.component';
import { SharedModule } from '../../../shared';


@NgModule({
  declarations: [ManageVariablesComponent],
  imports: [
    CommonModule,
    ManageVariablesRoutingModule,
    SharedModule
  ]
})
export class ManageVariablesModule { }
