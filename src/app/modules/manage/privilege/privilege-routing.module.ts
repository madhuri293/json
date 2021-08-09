import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivilegeComponent } from './privilege.component';


const routes: Routes = [
  { path: '', component: PrivilegeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivilegeRoutingModule { }
