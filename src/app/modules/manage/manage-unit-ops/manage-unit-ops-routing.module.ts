import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageUnitOpsComponent } from './manage-unit-ops.component';

const routes: Routes = [{
  path: '', component: ManageUnitOpsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageUnitOpsRoutingModule { }
