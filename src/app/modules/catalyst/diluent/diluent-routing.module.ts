import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiluentComponent } from './diluent.component';

const routes: Routes = [{
  path: '', component: DiluentComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiluentRoutingModule { }
