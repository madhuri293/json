import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NpdComponent } from './npd.component';

const routes: Routes = [{
  path: '', component: NpdComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NpdRoutingModule { }
