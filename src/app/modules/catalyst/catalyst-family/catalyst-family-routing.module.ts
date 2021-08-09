import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystFamilyComponent } from './catalyst-family.component';

const routes: Routes = [{
  path: '', component: CatalystFamilyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystFamilyRoutingModule { }
