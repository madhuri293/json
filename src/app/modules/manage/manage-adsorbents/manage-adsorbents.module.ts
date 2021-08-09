import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageAdsorbentsRoutingModule } from './manage-adsorbents-routing.module';
import { ManageAdsorbentsComponent } from '../manage-adsorbents/manage-adsorbents.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [ManageAdsorbentsComponent],
  imports: [
    CommonModule,
    ManageAdsorbentsRoutingModule,
    SharedModule
  ]
})
export class ManageAdsorbentsModule { }
