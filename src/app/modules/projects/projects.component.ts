import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';
import { ProjectType } from './projects.model';
import { StatusEnum } from '../../shared/enum/enum.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  projectList: any;
  projectType: ProjectType = new ProjectType();
  projectTypeId: any;
  tabId: string;
  projectTypeList: any;
  activeTab: any;

  constructor(private projectService: ProjectsService) {
    this.getProjectType();
  }

  ngOnInit() {
    this.projectService.loading = true;

  }


  getProjectListByProjectType(id: any) {
    this.projectService.getProjectListByProjectType(id).subscribe(projects => {
      this.projectList = projects.data;
    });
  }


  onTabClick(type: any) {
    this.projectType = type;
    this.activeTab = type.projectTypeName;
  }

  getProjectType() {
    this.projectService.getProjectType().subscribe(result => {
      this.projectService.loading = false;
      this.projectTypeList = result.data;
      this.projectTypeList.push({
        active: StatusEnum.Y,
        projectTypeCode: 'Project Files',
        projectTypeDesc: 'Project Files',
        projectTypeName: 'Project Files'
      });
      this.projectType = this.projectTypeList[0];
      this.activeTab = this.projectTypeList[0].projectTypeName;

    }, (error) => {
      this.projectService.loading = false;
    });
  }
}
