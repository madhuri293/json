import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantComponent } from './plant.component';
import { SharedModule } from '../../../shared';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: PlantComponent  }
];


@NgModule({
  declarations: [PlantComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule

  ]
})
export class PlantModule { }
