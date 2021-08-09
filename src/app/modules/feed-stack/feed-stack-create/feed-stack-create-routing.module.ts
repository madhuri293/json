import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedStackCreateComponent } from './feed-stack-create.component';

const routes: Routes = [{
  path: '', component: FeedStackCreateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedStackCreateRoutingModule { }
