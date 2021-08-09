import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectFilesRoutingModule } from './project-files-routing.module';
import { ProjectFilesComponent } from './project-files.component';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [ProjectFilesComponent],
  imports: [
    CommonModule,
    ProjectFilesRoutingModule,
    SharedModule
  ],
  exports: [ProjectFilesComponent]
})
export class ProjectFilesModule { }
