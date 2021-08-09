import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitOfMeasurementComponent } from './unit-of-measurement.component';

const routes: Routes = [{
  path: '', component: UnitOfMeasurementComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitOfMeasurementRoutingModule { }
