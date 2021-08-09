import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystMainMastersComponent } from './catalyst-main-masters.component';

const routes: Routes = [{
  path: '', component: CatalystMainMastersComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystMainMastersRoutingModule { }
