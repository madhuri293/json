import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerOrManufaturerComponent } from './customer-or-manufaturer.component';

const routes: Routes = [{
  path: '', component: CustomerOrManufaturerComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerOrManufaturerRoutingModule { }
