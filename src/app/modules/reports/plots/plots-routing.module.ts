import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlotsComponent } from './plots.component';


const routes: Routes = [{
  path: '', component: PlotsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlotsRoutingModule { }
