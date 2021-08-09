import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { SharedModule } from '../../shared';
import { NpdModule } from './npd/npd.module';
import { CapabilityModule } from './capability/capability.module';
import { CustomerOrManufaturerModule } from './customer-or-manufaturer/customer-or-manufaturer.module';
import { ProjectFilesModule } from './project-files/project-files.module';
import { NpdComponent } from './npd/npd.component';

@NgModule({
  declarations: [ProjectsComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule,
    NpdModule,
    CapabilityModule,
    CustomerOrManufaturerModule,
    ProjectFilesModule
  ],
  entryComponents: [NpdComponent]

})
export class ProjectsModule { }
