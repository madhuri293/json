import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { ProjectsService } from '../projects.service';
import { Project, Files, ProjectsDTO, TechnicalLeadFlyoutDTO } from '../projects.model';

import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { TechnologyService } from '../../manage/technology/technology.service';
import { UserService } from '../../manage/user/user.service';
import { User } from '../../manage/user/user.model';
import { SPACE_REGEXP, DESC_SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, ProjectsEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-customer-or-manufaturer',
  templateUrl: './customer-or-manufaturer.component.html'
})
export class CustomerOrManufaturerComponent implements OnInit {
  @Input() projectType: any;
  projectDTO: ProjectsDTO = new ProjectsDTO();
  technicalLeadFlyoutDTO: TechnicalLeadFlyoutDTO = new TechnicalLeadFlyoutDTO();
  constructor(private formBuilder: FormBuilder, public projectsService: ProjectsService,
    private technologyService: TechnologyService, private notify: NotificationService,
    private userService: UserService, private commonService: CommonService, private router: ActivatedRoute,
    private bsModalService: BsModalService, private dashboardService: DashboadrdService) {
    this.projectDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;
    this.getProjectData();
    this.getBuisnessJustification();
    this.geBuisnessObjective();
    this.getBuisnessGroup();
    this.projectFormControl();
    this.getTechnology();
    this.getStatus();
    this.getPpPriority();
    this.fileUploadFormControls();
    this.teamLeadFormControl();
    this.getApplication();
    this.projectDTO.files = this.projectDTO.fileUploadForm.get('uploadData') as FormArray;
    this.projectDTO.files.removeAt(0);
    this.projectDTO.nOfRecordPage = 10;
    this.projectDTO.projectsList = this.projectDTO.projectData;
    this.projectDTO.cols = [{ field: 'projectName', header: 'Project Name' },
    { field: 'technicalLeadName', header: 'Technichal Team Lead' },
    { field: 'businessObjectiveName', header: 'Business Objective' },
    { field: 'projectStatusName', header: 'Status' },
    ];
    if (this.projectDTO.privilege) {
      this.projectDTO.cols.push({ field: 'Action', header: 'Action' });
    }
    this.refresh();
  }


  projectFormControl() {
    this.projectDTO.projectForm = this.formBuilder.group({
      projectName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255),
      Validators.pattern(SPACE_REGEXP)])),
      buisnessGroup: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      technicalTeamLead: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      networkNumber1: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP),
      Validators.maxLength(255), Validators.pattern(SPACE_REGEXP)])),
      networkNumber2: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP),
      Validators.maxLength(255), Validators.pattern(SPACE_REGEXP)])),
      networkNumber3: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP),
      Validators.maxLength(255), Validators.pattern(SPACE_REGEXP)])),
      ppPriority: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      status: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      description: new FormControl('', Validators.compose([Validators.required, Validators.pattern(DESC_SPACE_REGEXP),
      Validators.maxLength(255)])),
      technology: new FormControl('', Validators.compose([Validators.maxLength(255)])),
      sfdc: new FormControl('', Validators.compose([Validators.pattern(SPACE_REGEXP), Validators.maxLength(100)])),
      buisnessObjective: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      buisnessJustification: new FormControl('', Validators.compose([Validators.maxLength(255)])),
      application: new FormControl('', Validators.compose([Validators.maxLength(255)])),
    });
  }

  teamLeadFormControl() {
    this.technicalLeadFlyoutDTO.teamLeadForm = this.formBuilder.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      eid: new FormControl(''),
      email: new FormControl('')

    });
  }

  remove(index: any) {
    this.projectDTO.allFileSize.splice(index, 1);
    this.projectDTO.fileNameArray.splice(index, 1);
    this.projectDTO.fileContent.splice(index, 1);
    this.projectDTO.fileTypeArray.splice(index, 1);
    this.projectDTO.files.removeAt(index);
    this.projectDTO.projectFilesArray.splice(index, 1);
    this.projectDTO.fileArray.splice(index, 1);
  }

  getProjectData() {
    this.projectsService.loading = true;
    this.projectsService.getProjectListByProjectType(this.projectType.id).subscribe(result => {
      this.projectDTO.projectData = result.data;
      this.projectDTO.totalRecords = this.projectDTO.projectData.length;
      this.projectsService.loading = false;
    }, (error) => {
      this.projectDTO.totalRecords = 0;
      this.projectsService.loading = false;
    });
  }

  getBuisnessJustification() {
    this.projectsService.getBussnessJustification().subscribe(result => {
      this.projectDTO.buisnessJustificationList = result.data;
    });
  }

  geBuisnessObjective() {
    this.projectsService.getBusinessObjective().subscribe(result => {
      this.projectDTO.buisnessObjective = result.data;
    });
  }

  getBuisnessGroup() {
    this.projectsService.getBusinessGroup().subscribe(result => {
      this.projectDTO.buisnessGroup = result.data;
    });
  }
  getStatus() {
    this.projectsService.getStatus().subscribe(result => {
      this.projectDTO.statusList = result.data;
    });
  }
  getTechnology() {
    const technologyId = localStorage.getItem('technology');
    this.projectDTO.project.technologyId = technologyId;
    this.technologyService.getAll().subscribe(result => {
      this.projectDTO.technologyList = result.data;
      this.projectDTO.technologyList = this.projectDTO.technologyList.filter(technology =>
        technology.status === StatusEnum.Y && technology.id === technologyId);

    });
  }
  getPpPriority() {
    this.projectsService.getPPPriority().subscribe(result => {
      this.projectDTO.currentPhasePriority = result.data;
    });
  }

  getApplication() {
    this.projectsService.getApplication().subscribe(result => {
      this.projectDTO.applicationList = result.data;
    });
  }

  addFileData() {
    this.projectDTO.files = this.projectDTO.fileUploadForm.get('uploadData') as FormArray;
    this.projectDTO.files.push(this.createFileData());
  }
  deleteConfirmation(project: any) {
    this.projectDTO.projectId = project.id;
    const sk = project.sk;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.projectsService.loading = true;
        this.projectsService.delete(this.projectDTO.projectId, sk).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.reset();
        }, (error) => {
          this.notify.showError(error.message);
          this.projectsService.loading = false;
        });
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });
  }
  customInput(el: any) {
    const fileInput = el.querySelector('[type="file"]');
    const label = el.querySelector('[data-js-label]');
    fileInput.onchange =
      fileInput.onmouseout = function () {
        alert('fileInput' + fileInput);
        if (!fileInput.value) {
          return;
        }
        const value = fileInput.value.replace(/^.*[\\\/]/, '');
        el.className += ' -chosen';
        label.innerText = value;
      };
  }
  save(project: any) {
    this.projectsService.loading = true;
    this.projectDTO.isDisabled = true;
    delete project.projectFiles;
    delete project.gate2; delete project.gate3; delete project.gate4; delete project.gate4; delete project.gate5;
    project.projectTypeId = this.projectType.id;
    project.technicalLeadId = this.projectDTO.leadId;
    this.projectDTO.allFileSize.forEach(data => {
      this.projectDTO.fileSize += data;
    });

    this.projectDTO.project.projectDocuments = this.projectDTO.fileArray;
    let uploadArray;
    uploadArray = this.projectDTO.fileUploadForm.get('uploadData').value;
    this.projectDTO.project.projectDocuments = this.projectDTO.fileArray;
    this.projectDTO.fileSizeErrorMessage = null;
    this.projectDTO.project.projectDocuments.forEach((file, i) => {
      file.fileDescription = uploadArray[i].description;
    });
    this.projectDTO.fileSizeErrorMessage = null;
    project.projectFiles = this.projectDTO.project.projectDocuments;
    if (project.id) {
      this.projectsService.update(project).subscribe(result => {
        this.reset();
        this.projectDTO.isDisabled = false;
        this.projectsService.loading = false;
        this.notify.showSuccess(result.body.message);

      },
        (error) => {
          this.projectDTO.isDisabled = false;
          this.projectsService.loading = false;
          this.notify.showError(error.message);

        });
    } else {
      this.projectsService.save(project).subscribe(result => {
        this.reset();
        this.projectDTO.isDisabled = false;
        this.projectsService.loading = false;
        this.notify.showSuccess(result.body.message);
      }, error => {
        this.projectDTO.isDisabled = false;
        this.projectsService.loading = false;
        project.projectFiles = null;
        this.notify.showError(error.message);
      });
    }

  }
  compareFn(c1: any, c2: any) {
    return (c1 && c2) && c1.id === c2.id;
  }

  onUploadClick(event: any, i: number, description: any) {
    this.projectsService.loading = true;
    const fileNameList = event.target.files[0].name.split('.');
    const fileName = event.target.files[0].name.split('.')[fileNameList.length - 1];
    if (fileName !== ProjectsEnum.PDF && fileName !== ProjectsEnum.PPTX && fileName !== ProjectsEnum.TXT && fileName !== ProjectsEnum.JPEG
      && fileName !== ProjectsEnum.XLSX && fileName !== ProjectsEnum.csv && fileName !== ProjectsEnum.XLS && fileName !== ProjectsEnum.DOCX
      && fileName !== ProjectsEnum.DOC && fileName !== ProjectsEnum.JPG &&
      fileName !== ProjectsEnum.JFIF && fileName !== ProjectsEnum.JPE) {
      this.notify.showWarning('File format not supported');
      this.projectsService.loading = false;
    } else {
      const size = (event.target.files[0].size / 1000) - 200;
      this.projectsService.loading = false;
      if (size > 6000) {
        this.notify.showWarning('File size can not be greater than 6MB');
      } else {
        const reader = new FileReader();
        if (this.projectDTO.fileArray.length > i) {
          const file: File = event.target.files[0];
          reader.readAsDataURL(file);
          this.projectDTO.filesObj = new Files();
          this.projectDTO.filesObj.contentType = file.type;
          this.projectDTO.filesObj.fileDescription = '';
          this.projectDTO.totalFileSize[i] = file.size / (1000);
          this.projectDTO.filesObj.fileSize = file.size / (1000) + 'KB';
          this.projectDTO.filesObj.fileName = file.name;
          reader.onload = () => {
            const value = (reader.result as string).split(',')[1];
            this.projectDTO.filesObj.fileStream = value;
            this.projectDTO.projectFilesArray.splice(i, 1);
            this.projectDTO.fileArray.slice(i, 1);
            this.projectDTO.fileArray[i] = this.projectDTO.filesObj;
          };
          this.projectDTO.fileArray.push(this.projectDTO.filesObj);
          this.projectDTO.fileArray.splice(this.projectDTO.fileArray.length - 1);
        } else {
          const file: File = event.target.files[0];
          this.projectDTO.filesObj = new Files();
          this.projectDTO.filesObj.contentType = file.type;
          this.projectDTO.filesObj.fileDescription = '';
          this.projectDTO.totalFileSize.push(file.size / (1000));
          this.projectDTO.filesObj.fileSize = file.size / (1000) + 'KB';
          this.projectDTO.filesObj.fileName = file.name;
          reader.readAsDataURL(file);
          reader.onload = () => {
            const value = (reader.result as string).split(',')[1];
            this.projectDTO.filesObj.fileStream = value;
            this.projectDTO.projectFilesArray.splice(i, 1);
          };
          this.projectDTO.fileArray.push(this.projectDTO.filesObj);
        }
        this.projectDTO.fileSize = 0;
        this.projectDTO.totalFileSize.forEach(data => {
          this.projectDTO.fileSize += data;
        });
        this.projectsService.loading = false;

      }
    }
  }
  fileUploadFormControls() {
    this.projectDTO.fileUploadForm = this.formBuilder.group({
      uploadData: this.formBuilder.array([this.createFileData()])
    });
  }
  createFileData(): FormGroup {
    return this.formBuilder.group({
      description: new FormControl('', Validators.compose([Validators.maxLength(500)])),
      name: new FormControl()
    });
  }

  get formArray() {
    const formArray = this.projectDTO.fileUploadForm.get('uploadData') as FormArray;
    return formArray;
  }

  find(project: any) {
    this.projectDTO.totalRecords = 0;
    this.projectsService.loading = true;
    if (this.projectDTO.projectForm.dirty || this.projectDTO.projectForm.valid ||
      this.projectDTO.projectForm.controls['technicalTeamLead'].valid) {
      this.projectDTO.nametechnicalLeadId = project.technicalLeadId;
      if (project.technicalLeadId) {
        project.technicalLeadId = this.projectDTO.leadId;
      }
      project.projectTypeId = this.projectType.id;
      project.technologyId = localStorage.getItem('technology');
      this.projectsService.find(project).subscribe(result => {
        this.projectDTO.project.technicalLeadId = this.projectDTO.nametechnicalLeadId;
        this.projectsService.loading = false;
        this.commonService.sendToggleFlag(true);

        this.projectDTO.projectsList = result.body.data;
        this.projectDTO.projectData = this.projectDTO.projectsList;
        this.projectDTO.totalRecords = this.projectDTO.projectData.length;
        this.notify.showSuccess(result.body.message);
      }, (error) => {
        this.projectsService.loading = false;
        this.projectDTO.projectsList = [];
        this.notify.showError(error.message);

      });
    } else {
      this.notify.showError('Enter at least one field to search');
    }
  }


  onFlyoutLoad() {
    this.technicalLeadFlyoutDTO.user = new User();
    this.technicalLeadFlyoutDTO.loadFlyoutTable = true;
    this.projectsService.loading = true;
    this.technicalLeadFlyoutDTO.columnList = [
      { field: 'eId', header: 'Eid' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'email', header: 'Email' }
    ];
    this.userService.getTeamLead().subscribe(result => {
      this.technicalLeadFlyoutDTO.teamLeadList = result.data;
      this.technicalLeadFlyoutDTO.flyOutTotalRecords = this.technicalLeadFlyoutDTO.teamLeadList.length;
      this.technicalLeadFlyoutDTO.nOfRecords = 10;
      this.projectsService.loading = false;
    }, (error) => {
      this.projectsService.loading = false;
    });
  }

  onEditClick(data: any) {

    this.technicalLeadFlyoutDTO.user = data;
    this.projectDTO.project.technicalLeadId =
      this.technicalLeadFlyoutDTO.user.firstName + ',' + this.technicalLeadFlyoutDTO.user.lastName;
    this.projectDTO.selectedLeadName = this.technicalLeadFlyoutDTO.user.firstName + ',' + this.technicalLeadFlyoutDTO.user.lastName;
    const flyoutModelClose = document.getElementById('flyoutModal');
    this.projectDTO.leadId = data.id;
    flyoutModelClose.click();
    this.flyoutFormReset();
  }

  findUser(user: any) {
    this.userService.findTeamLeads(user).subscribe(result => {
      this.technicalLeadFlyoutDTO.user = result.data;
    });
  }

  onProjectEdit(project: any) {
    this.projectDTO.isDisabled = false;
    this.projectDTO.fileArray = [];
    while (this.projectDTO.files.length !== 0) {
      this.projectDTO.files.removeAt(0);
    }
    this.projectsService.getProjectById(project.id).subscribe(
      result => {
        this.projectDTO.leadId = result.data.technicalLeadId;
        this.userService.getById(this.projectDTO.leadId).subscribe(lead => {
          this.technicalLeadFlyoutDTO.teamLeadList = lead.data;
          if (lead.data.id === result.data.technicalLeadId) {
            result.data.technicalLeadId = lead.data.firstName + ',' + lead.data.lastName;
          }
        });
        this.projectDTO.project = result.data;
        while (this.projectDTO.files.length !== 0) {
          this.projectDTO.files.removeAt(0);
        }
        if (this.projectDTO.project.projectDocuments) {
          this.projectDTO.projectFilesArray = this.projectDTO.project.projectDocuments;
        }
        if (this.projectDTO.project.projectDocuments) {
          for (let i = 0; i < this.projectDTO.project.projectDocuments.length; i++) {
            this.addFileData();
          }
        }
        if (this.projectDTO.project.projectDocuments) {
          this.projectDTO.project.projectDocuments.forEach((val, i) => {
            this.projectDTO.fileArray.push(val);
            const filesArray = this.projectDTO.fileUploadForm.get('uploadData') as FormArray;
            filesArray.controls[i].patchValue({ description: val.fileDescription });
          });
        }

      }, error => {
        this.notify.showError(error.message);
      });
  }

  findLead(lead: any) {
    this.projectsService.loading = true;
    this.userService.findTeamLead(lead).subscribe(
      result => {
        this.technicalLeadFlyoutDTO.teamLeadList = result.body.data;
        this.technicalLeadFlyoutDTO.flyOutTotalRecords = this.technicalLeadFlyoutDTO.teamLeadList.length;
        this.technicalLeadFlyoutDTO.nOfRecords = 10;
        this.projectsService.loading = false;
        this.commonService.sendToggleFlag(true);
        this.notify.showSuccess(result.body.message);
      }, error => {
        this.projectsService.loading = false;
        this.technicalLeadFlyoutDTO.teamLeadList = null;
        this.technicalLeadFlyoutDTO.flyOutTotalRecords = 0;
        this.notify.showError(error.message);
      });
  }

  reset() {
    this.getProjectData();
    this.projectDTO.project = new Project();
    this.projectDTO.projectForm.reset();
    this.projectDTO.fileUploadForm.reset();
    this.projectDTO.fileArray = [];
    this.getTechnology();
    this.commonService.sendToggleFlag(true);

    this.projectDTO.fileUploadForm.get('uploadData').reset();
    while (this.projectDTO.files.length !== 0) {
      this.projectDTO.files.removeAt(0);
    }
    while (this.projectDTO.totalFileSize.length !== 0) {
      this.projectDTO.totalFileSize.pop();
      this.projectDTO.fileSize = 0;
    }
  }



  downloadFile(data: any) {
    if (data.id) {
      window.open(data.filePath);
    } else {
      this.notify.showWarning('save the file to download');
    }
  }

  flyoutFormReset() {
    this.technicalLeadFlyoutDTO.teamLeadForm.reset();
    this.onFlyoutLoad();
    this.commonService.sendToggleFlag(true);

  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.dashboardService.showTechnologyHeader = true;
        this.getProjectData();
        this.getBuisnessJustification();
        this.geBuisnessObjective();
        this.getBuisnessGroup();
        this.projectFormControl();
        this.getTechnology();
        this.getStatus();
        this.getPpPriority();
        this.fileUploadFormControls();
        this.teamLeadFormControl();
        this.getApplication();
        this.projectDTO.files = this.projectDTO.fileUploadForm.get('uploadData') as FormArray;
        this.projectDTO.files.removeAt(0);
        this.projectDTO.nOfRecordPage = 10;
        this.projectDTO.projectsList = this.projectDTO.projectData;
        this.projectDTO.cols = [{ field: 'projectName', header: 'Project Name' },
        { field: 'technicalLeadName', header: 'Technichal Team Lead' },
        { field: 'businessObjectiveName', header: 'Business Objective' },
        { field: 'projectStatusName', header: 'Status' },
        ];
        if (this.projectDTO.privilege) {
          this.projectDTO.cols.push({ field: 'Action', header: 'Action' });
        }
      }
    })
  }
}
