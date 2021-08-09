import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedStackComponent } from './feed-stack.component';

const routes: Routes = [{
  path: '', component: FeedStackComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedStackRoutingModule { }
