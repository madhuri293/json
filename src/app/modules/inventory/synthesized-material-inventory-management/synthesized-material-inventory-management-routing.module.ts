import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SynthesizedMaterialInventoryManagementComponent } from './synthesized-material-inventory-management.component';

const routes: Routes = [{
  path: '', component: SynthesizedMaterialInventoryManagementComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SynthesizedMaterialInventoryManagementRoutingModule { }
