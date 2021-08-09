import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-project-files',
  templateUrl: './project-files.component.html'
})
export class ProjectFilesComponent implements OnInit {
  cols: any[];
  dataList: any = [];
  totalRecords: number;
  nOfRecords: number;
  projectFileList: any;
  projectData: any;

  constructor(public projectService: ProjectsService) { }

  ngOnInit() {
    this.nOfRecords = 10;
    this.projectService.loading = true;

    this.cols = [{ field: 'fileName', header: 'File Name' },
    { field: 'projectName', header: 'Project Name' },
    { field: 'projectTypeName', header: 'Project type' },
    { field: 'fileDescription', header: 'Description' },
    { field: 'fileSize', header: 'File Size' },
    { field: 'updatedOnDate', header: 'Date Modified' },
    ];
    this.getFileList();
    this.totalRecords = this.dataList.length;
  }

  getFileList() {
    this.projectService.getAllProjectFiles().subscribe(result => {
      this.projectFileList = result.data;
      this.totalRecords = this.projectFileList.length;
      this.projectService.loading = false;
    },
      (error) => {
        this.totalRecords = this.projectData.length;
        this.projectService.loading = false;
      });
  }

}
