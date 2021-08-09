import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MPTUnitOpsComponent } from './mpt-unit-ops.component';

const routes: Routes = [{
  path: '', component: MPTUnitOpsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MPTUnitOpsRoutingModule { }
