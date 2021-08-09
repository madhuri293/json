import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalystShapeRoutingModule } from './catalyst-shape-routing.module';
import { CatalystShapeComponent } from './catalyst-shape.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [CatalystShapeComponent],
  imports: [
    CommonModule,
    CatalystShapeRoutingModule,
    SharedModule
  ]
})
export class CatalystShapeModule { }
