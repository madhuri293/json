import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UomTemplateRoutingModule } from './uom-template-routing.module';
import { UomTemplateComponent } from './uom-template.component';
import { SharedModule } from '../../../shared';


@NgModule({
  declarations: [UomTemplateComponent],
  imports: [
    CommonModule,
    UomTemplateRoutingModule,
    SharedModule
  ]
})
export class UomTemplateModule { }
