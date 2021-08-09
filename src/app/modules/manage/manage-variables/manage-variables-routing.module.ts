import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageVariablesComponent } from './manage-variables.component';

const routes: Routes = [{
  path: '' , component: ManageVariablesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageVariablesRoutingModule { }
