import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UomTemplateComponent } from './uom-template.component';

const routes: Routes = [{
  path: '', component: UomTemplateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UomTemplateRoutingModule { }
