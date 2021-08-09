import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalystInventoryManagementComponent } from './catalyst-inventory-management.component';

const routes: Routes = [{
  path: '', component: CatalystInventoryManagementComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystInventoryManagementRoutingModule { }
