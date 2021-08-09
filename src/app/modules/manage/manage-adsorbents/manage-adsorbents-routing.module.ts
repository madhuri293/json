import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAdsorbentsComponent } from './manage-adsorbents.component';

const routes: Routes = [{
  path: '', component: ManageAdsorbentsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAdsorbentsRoutingModule { }
