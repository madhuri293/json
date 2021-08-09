import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StandardCutRangesComponent } from './standard-cut-ranges.component';

const routes: Routes = [{
  path: '', component: StandardCutRangesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandardCutRangesRoutingModule { }
