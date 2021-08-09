import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LIMSComponent } from './lims.component';

const routes: Routes = [{
  path: '', component: LIMSComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LIMSRoutingModule { }
