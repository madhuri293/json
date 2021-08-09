import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectFilesComponent } from './project-files.component';

const routes: Routes = [{
  path: '', component: ProjectFilesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectFilesRoutingModule { }
