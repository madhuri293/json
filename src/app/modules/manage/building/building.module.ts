import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingComponent } from './building.component';
import { BuildingRoutingModule } from './building-routing.module';
import { SharedModule } from '../../../shared';
@NgModule({
  declarations: [BuildingComponent],
  imports: [
    CommonModule,
    BuildingRoutingModule,
    SharedModule
  ],
})
export class BuildingModule { }
