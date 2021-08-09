import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystLoadingTemplateRoutingModule } from './catalyst-loading-template-routing.module';
import { CatalystLoadingTemplateComponent } from './catalyst-loading-template.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [CatalystLoadingTemplateComponent],
  imports: [
    CommonModule, SharedModule,
    CatalystLoadingTemplateRoutingModule
  ]
})
export class CatalystLoadingTemplateModule { }
