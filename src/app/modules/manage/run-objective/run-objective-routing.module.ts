import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RunObjectiveComponent } from './run-objective.component';

const routes: Routes = [{
  path: '', component: RunObjectiveComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunObjectiveRoutingModule { }
