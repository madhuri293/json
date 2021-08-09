import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystLoadingTemplateComponent } from './catalyst-loading-template.component';

const routes: Routes = [{
  path: '', component: CatalystLoadingTemplateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystLoadingTemplateRoutingModule { }
