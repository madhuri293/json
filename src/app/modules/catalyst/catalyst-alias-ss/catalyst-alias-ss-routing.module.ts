import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystAliasSsComponent } from './catalyst-alias-ss.component';

const routes: Routes = [{
  path: '', component: CatalystAliasSsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystAliasSsRoutingModule { }
