import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChemicalsUsedComponent } from './chemicals-used.component';

const routes: Routes = [{
  path: '', component: ChemicalsUsedComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChemicalsUsedRoutingModule { }
