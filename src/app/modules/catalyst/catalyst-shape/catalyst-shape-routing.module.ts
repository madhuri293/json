import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystShapeComponent } from './catalyst-shape.component';

const routes: Routes = [{
  path: '', component: CatalystShapeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystShapeRoutingModule { }
