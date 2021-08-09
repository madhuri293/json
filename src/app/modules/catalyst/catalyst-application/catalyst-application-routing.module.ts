import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystApplicationComponent } from './catalyst-application.component';



const routes: Routes = [{
  path: '', component: CatalystApplicationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystApplicationRoutingModule { }
