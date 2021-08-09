import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystTypeComponent } from './catalyst-type.component';

const routes: Routes = [{
  path: '', component: CatalystTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystTypeRoutingModule { }
