import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystStateComponent } from './catalyst-state.component';

const routes: Routes = [{
  path: '', component: CatalystStateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystStateRoutingModule { }
