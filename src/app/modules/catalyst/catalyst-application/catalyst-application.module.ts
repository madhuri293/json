import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { CatalystApplicationComponent } from './catalyst-application.component';
import { CatalystApplicationRoutingModule } from './catalyst-application-routing.module';

@NgModule({
  declarations: [CatalystApplicationComponent],
  imports: [
    CommonModule,
    SharedModule,
    CatalystApplicationRoutingModule
  ]
})
export class CatalystApplicationModule { }
