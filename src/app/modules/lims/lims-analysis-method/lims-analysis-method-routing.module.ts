import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LimsAnalysisMethodComponent } from './lims-analysis-method.component';

const routes: Routes = [{
  path: '', component: LimsAnalysisMethodComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LimsAnalysisMethodRoutingModule { }
