import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlantComponent } from './plant.component';


const routes: Routes = [
  { path: '', component: PlantComponent  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantRoutingModule { }
