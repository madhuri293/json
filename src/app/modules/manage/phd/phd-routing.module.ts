import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhdComponent } from './phd.component';

const routes: Routes = [{
  path: '', component: PhdComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhdRoutingModule { }
