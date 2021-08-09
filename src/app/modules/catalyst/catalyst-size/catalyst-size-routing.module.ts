import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystSizeComponent } from './catalyst-size.component';

const routes: Routes = [{
  path: '', component: CatalystSizeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystSizeRoutingModule { }
