import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivilegeRoutingModule } from './privilege-routing.module';
import { PrivilegeComponent } from './privilege.component';
import { SharedModule } from '../../../shared';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  declarations: [PrivilegeComponent],
  imports: [
    CommonModule,
    PrivilegeRoutingModule,
    TreeModule.forRoot(),
    SharedModule
  ]
})
export class PrivilegeModule { }
