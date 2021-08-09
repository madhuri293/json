import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystComponent } from './catalyst.component';

const routes: Routes = [{
  path: '', component: CatalystComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystRoutingModule { }
