import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRawMaterialsComponent } from './manage-raw-materials.component';

const routes: Routes = [{
  path: '', component: ManageRawMaterialsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRawMaterialsRoutingModule { }
