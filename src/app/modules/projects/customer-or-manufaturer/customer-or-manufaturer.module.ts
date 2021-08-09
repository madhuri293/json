import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerOrManufaturerRoutingModule } from './customer-or-manufaturer-routing.module';
import { CustomerOrManufaturerComponent } from './customer-or-manufaturer.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [CustomerOrManufaturerComponent],
  imports: [
    CommonModule,
    CustomerOrManufaturerRoutingModule,
    SharedModule
  ],
  exports: [CustomerOrManufaturerComponent]
})
export class CustomerOrManufaturerModule { }
