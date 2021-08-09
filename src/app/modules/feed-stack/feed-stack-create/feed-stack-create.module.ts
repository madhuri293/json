import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedStackCreateRoutingModule } from './feed-stack-create-routing.module';
import { FeedStackCreateComponent } from './feed-stack-create.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [FeedStackCreateComponent],
  imports: [
    CommonModule, SharedModule,
    FeedStackCreateRoutingModule,
    SharedModule
  ]
})
export class FeedStackCreateModule { }
