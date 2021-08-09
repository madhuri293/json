import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystScaleComponent } from './catalyst-scale.component';

const routes: Routes = [{
  path: '' , component: CatalystScaleComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystScaleRoutingModule { }
