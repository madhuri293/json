import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RawMaterialInventoryComponent } from './raw-material-inventory.component';

const routes: Routes = [{
  path: '', component: RawMaterialInventoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RawMaterialInventoryRoutingModule { }
