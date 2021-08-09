import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProjectsService } from '../projects.service';
import {
  Project, ProjectType, Files,
  ProjectsDTO, TechnicalLeadFlyoutDTO
} from '../projects.model';
import { UserService } from '../../manage/user/user.service';
import { CapabilityModel } from './capability.model';
import { NotificationService } from '../../../core/services/notification/notification-service.service';

import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { DESC_SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { TechnologyService } from '../../manage/technology/technology.service';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, ProjectsEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
@Component({
  selector: 'app-capability',
  templateUrl: './capability.component.html'
})
export class CapabilityComponent implements OnInit {
  @Input() projectType: ProjectType;
  projectsDTO: ProjectsDTO = new ProjectsDTO();
  technicalLeadFlyoutDTO: TechnicalLeadFlyoutDTO = new TechnicalLeadFlyoutDTO();
  constructor(private formBuilder: FormBuilder,
    public projectsService: ProjectsService,
    private userService: UserService,
    private notify: NotificationService,
    private technologyService: TechnologyService,
    private commonService: CommonService,
    private bsModalService: BsModalService,
    private router: ActivatedRoute, private dashboardService: DashboadrdService) {
    this.projectsDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }
  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;
    this.projectsDTO.flag = true;
    this.getProject(this.projectType.id);
    this.getUOPSegment();
    this.getPPPriority();
    this.getStatus();
    this.getCurrentPhase();
    this.fileUploadFormControls();
    this.capabilityFormControls();
    this.getTeamLeads();
    this.getTechnologies();
    this.projectsDTO.uploadfile = this.projectsDTO.fileUploadForm.get('uploadfile') as any;
    this.projectsDTO.uploadfile.removeAt(0);
    this.projectsDTO.uploadfile = '';
    this.projectsDTO.nOfRecordPage = 10;
    this.technicalLeadFlyoutDTO.technicalnOfRecordPage = 10;
    this.refresh();

  }
  getUOPSegment() {
    this.projectsService.getUopSegment().subscribe(result => {
      this.projectsDTO.uopSegmentOptions = result.data;
    });
  }
  getPPPriority() {
    this.projectsService.getPPPriority().subscribe(result => {
      this.projectsDTO.ppPriorityOption = result.data;
    });
  }
  getStatus() {
    this.projectsService.getStatus().subscribe(result => {
      this.projectsDTO.capabilitystatus = result.data;
    });
  }
  getCurrentPhase() {
    this.projectsService.getCurrentPhase().subscribe(result => {
      this.projectsDTO.currentPhase = result.data;
    });
  }
  capabilityFormControls() {
    this.projectsDTO.capabilityForm = this.formBuilder.group({
      projectname: ['', Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern(SPACE_REGEXP)])],
      phasePriority: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      teamLead: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      uopSEG: ['', Validators.compose([Validators.required])],
      networkNumber1: ['', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP), Validators.maxLength(20)])],
      networkNumber2: ['', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP), Validators.maxLength(20)])],
      networkNumber3: ['', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP), Validators.maxLength(20)])],
      ppPriority: ['', Validators.compose([Validators.required])],
      sbu: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      pte: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      description: ['', Validators.compose([Validators.required, Validators.pattern(DESC_SPACE_REGEXP), Validators.maxLength(255)])],
      status: ['', Validators.compose([Validators.required])],
      technologyCode: ['', Validators.compose([Validators.maxLength(255)])]
    });
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      fileName: [''],
      fileDescription: ['', Validators.compose([Validators.maxLength(500)])],
    });
  }
  fileUploadFormControls() {
    this.projectsDTO.fileUploadForm = this.formBuilder.group({
      uploadfile: this.formBuilder.array([this.createItem()])
    });
  }

  get formArray() {
    return this.projectsDTO.fileUploadForm.get('uploadfile') as FormArray;
  }
  getProject(id: any) {
    this.projectsService.loading = true;
    this.projectsService.getProjectListByProjectType(id).subscribe(projectinfo => {
      this.projectsDTO.projectList = projectinfo.data;
      this.projectsDTO.cols = [
        { field: 'projectName', header: 'Project Name' },
        { field: 'currentPhasePriorityName', header: 'Current Phase Priority' },
        { field: 'technicalLeadName', header: 'Technichal Team Lead' },
        { field: 'ppPriorityName', header: 'PP Priority' },
        { field: 'projectStatusName', header: 'Status' }
      ];
      if (this.projectsDTO.privilege) {
        this.projectsDTO.cols.push({ field: '', header: 'Action' });
      }
      this.projectsDTO.totalRecords = this.projectsDTO.projectList.length;
      this.projectsService.loading = false;
    }, (error) => {
      this.projectsDTO.projectDetail = [];
      this.projectsDTO.totalRecords = 0;
      this.projectsService.loading = false;
    });
  }

  save(project: any) {
    this.projectsService.loading = true;
    this.projectsDTO.isDisabled = true;
    project.technicalLeadId = this.projectsDTO.leadId;
    project.projectTypeId = this.projectType.id;
    this.projectsDTO.allFileSize.forEach(data => {
      this.projectsDTO.fileSize += data;
    });
    let uploadArray;
    uploadArray = this.projectsDTO.fileUploadForm.get('uploadfile').value;
    this.projectsDTO.project.projectDocuments = this.projectsDTO.fileArray;
    this.projectsDTO.project.projectDocuments.forEach((file, i) => {
      file.fileDescription = uploadArray[i].fileDescription;
    });
    this.projectsDTO.fileSizeErrorMessage = null;
    if (project.id) {
      this.projectsService.update(project).subscribe(result => {
        this.projectsDTO.isDisabled = false;
        this.projectsService.loading = false;
        this.resetForm();
        this.notify.showSuccess(result.body.message);
      },
        (error) => {
          this.projectsDTO.isDisabled = false;
          this.projectsService.loading = false;
          this.projectsDTO.project.technicalLeadId = this.projectsDTO.selectedLeadName;
          this.notify.showError(error.message);
        });
    } else {
      this.projectsService.save(project).subscribe(result => {
        this.resetForm();
        this.projectsDTO.isDisabled = false;
        this.projectsService.loading = false;
        this.notify.showSuccess(result.body.message);
      }, error => {
        this.projectsDTO.isDisabled = false;
        this.projectsService.loading = false;
        project.projectFiles = null;
        this.projectsDTO.project.technicalLeadId = this.projectsDTO.selectedLeadName;
        this.notify.showError(error.message);
      });
    }
  }

  addFileData(): void {
    this.projectsDTO.uploadfile = this.projectsDTO.fileUploadForm.get('uploadfile') as any;
    this.projectsDTO.uploadfile.push(this.createItem());
  }
  remove(current_data) {
    this.projectsDTO.uploadfile = this.projectsDTO.fileUploadForm.get('uploadfile') as any;
    this.projectsDTO.uploadfile.removeAt(current_data);
    this.projectsDTO.allFileSize.splice(current_data, 1);
    this.projectsDTO.fileNameArray.splice(current_data, 1);
    this.projectsDTO.fileContent.splice(current_data, 1);
    this.projectsDTO.fileTypeArray.splice(current_data, 1);
    this.projectsDTO.projectFilesArray.splice(current_data, 1);
    this.projectsDTO.fileArray.splice(current_data, 1);
    this.projectsDTO.totalFileSize.splice(current_data, 1);
  }
  resetForm() {
    this.getProject(this.projectType.id);
    this.projectsDTO.project = new Project();
    this.projectsDTO.capabilityForm.reset();
    this.projectsDTO.fileArray = [];
    this.getTechnologies();
    while (this.projectsDTO.uploadfile.length !== 0) {
      this.projectsDTO.uploadfile.removeAt(0);
    }
    this.projectsDTO.projectFilesArray = [];
    this.projectsDTO.priorityselect = '';
    this.commonService.sendToggleFlag(true);

  }
  customInput(el: any) {
    const fileInput = el.querySelector('[type="file"]');
    const label = el.querySelector('[data-js-label]');
    fileInput.onchange =
      fileInput.onmouseout = function () {
        if (!fileInput.value) {
          return;
        }
        const value = fileInput.value.replace(/^.*[\\\/]/, '');
        el.className += ' -chosen';
        label.innerText = value;
      };
  }
  getTeamLeads() {
    this.technicalLeadFlyoutDTO.capability = new CapabilityModel();
    this.projectsService.loading = true;
    this.userService.getTechnicalTeamLead().subscribe(result => {
      this.technicalLeadFlyoutDTO.technicleTeam = result.data;
      this.technicalLeadFlyoutDTO.technicalcols = [
        { field: 'eId', header: 'Eid' },
        { field: 'firstName', header: 'First Name' },
        { field: 'lastName', header: 'Last Name' },
        { field: 'email', header: 'Email' },
      ];
      this.technicalLeadFlyoutDTO.flyOutTotalRecords = this.technicalLeadFlyoutDTO.technicleTeam.length;
      this.projectsService.loading = false;
    }, (error) => {
      this.projectsService.loading = false;
    });
    this.leadreset();
  }
  techicalTeamFind(techicalTeamData: any) {
    this.userService.findTeamLead(techicalTeamData).subscribe(result => {
      const team = result.body.data;
      this.technicalLeadFlyoutDTO.technicleTeam = result.body.data;
      this.technicalLeadFlyoutDTO.technicalcols = [
        { field: 'eId', header: 'EId' },
        { field: 'firstName', header: 'First Name' },
        { field: 'lastName', header: 'Last Name' },
        { field: 'email', header: 'Email' }
      ];
      this.technicalLeadFlyoutDTO.flyOutTotalRecords = team.length;
        this.notify.showSuccess(result.body.message);
    });
  }
  leadEdit(UserData: any) {
    this.technicalLeadFlyoutDTO.capability = UserData;
    this.projectsDTO.project.technicalLeadId = UserData.firstName + ',' + UserData.lastName;
    this.projectsDTO.selectedLeadName = UserData.firstName + ',' + UserData.lastName;
    const flyoutModelClose = document.getElementById('flyoutModal');
    this.projectsDTO.leadId = UserData.id;
    flyoutModelClose.click();
    this.flyoutFormReset();
  }
  leadreset() {
    this.technicalLeadFlyoutDTO.teamLeadForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      eId: ['']
    });
  }
  onDeleteClick(project: any) {
    this.projectsDTO.projectId = project.id;
    const sk = project.sk;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.projectsService.loading = true;
        this.projectsService.delete(this.projectsDTO.projectId, sk).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.resetForm();
        }, (error) => {
          this.notify.showError(error.message);
          this.projectsService.loading = false;
        });
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });


  }
  onEdit1(capabilityData: any) {
    this.projectsDTO.isDisabled = false;
    this.projectsDTO.fileArray = [];
    while (this.projectsDTO.uploadfile.length !== 0) {
      this.projectsDTO.uploadfile.removeAt(0);
    }
    this.projectsService.getProjectById(capabilityData.id).subscribe(
      result => {
        this.projectsDTO.leadId = result.data.technicalLeadId;
        this.userService.getById(this.projectsDTO.leadId).subscribe(user => {
          result.data.technicalLeadId = user.data.firstName + ',' + user.data.lastName;
          this.projectsDTO.selectedLeadName = result.data.technicalLeadId;
        });
        this.projectsDTO.project = result.data;
        if (this.projectsDTO.project.projectDocuments) {
          for (let i = 0; i < this.projectsDTO.project.projectDocuments.length; i++) {
            this.addFileData();
          }
          this.projectsDTO.project.projectDocuments.forEach((val, i) => {
            this.projectsDTO.fileArray.push(val);
            const filesArray = this.projectsDTO.fileUploadForm.get('uploadfile') as FormArray;
            filesArray.controls[i].patchValue({ fileDescription: val.fileDescription });
          });
        }
      }, error => {
        this.notify.showError(error.message);
      });
    this.projectsDTO.flag = false;

  }
  onUploadClick(event: any, i: number, description: any) {

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
      if (size > 6000) {
        this.notify.showWarning('File size can not be greater than 6MB');
        this.projectsService.loading = false;
      } else {
        const reader = new FileReader();
        if (this.projectsDTO.fileArray.length > i) {
          const file: File = event.target.files[0];
          reader.readAsDataURL(file);
          this.projectsDTO.filesObj = new Files();
          this.projectsDTO.filesObj.contentType = file.type;
          this.projectsDTO.totalFileSize.push(file.size / (1000));
          this.projectsDTO.filesObj.fileSize = file.size / (1000) + ProjectsEnum.KB;
          this.projectsDTO.filesObj.fileName = file.name;
          reader.onload = () => {
            const value = (reader.result as string).split(',')[1];
            this.projectsDTO.filesObj.data = value;
            this.projectsDTO.projectFilesArray.splice(i, 1);
            this.projectsDTO.fileArray.slice(i, 1);
            this.projectsDTO.fileArray[i] = this.projectsDTO.filesObj;
          };
          this.projectsDTO.fileArray.push(this.projectsDTO.filesObj);
          this.projectsDTO.fileArray.splice(this.projectsDTO.fileArray.length - 1);
        } else {
          this.projectsService.loading = true;
          const file: File = event.target.files[0];
          this.projectsDTO.filesObj = new Files();
          this.projectsDTO.filesObj.contentType = file.type;
          this.projectsDTO.totalFileSize.push(file.size / (1000));
          this.projectsDTO.filesObj.fileSize = file.size / (1000) + ProjectsEnum.KB;
          this.projectsDTO.filesObj.fileName = file.name;
          reader.readAsDataURL(file);
          reader.onload = () => {
            const value = (reader.result as string).split(',')[1];
            this.projectsDTO.filesObj.data = value;
            this.projectsDTO.projectFilesArray.splice(i, 1);
          };
          this.projectsDTO.fileArray.push(this.projectsDTO.filesObj);
        }
        this.projectsDTO.fileSize = 0;
        this.projectsDTO.totalFileSize.forEach(data => {
          this.projectsDTO.fileSize += data;
        });
        this.projectsService.loading = false;
      }
    }
  }
  find(project: any) {
    this.projectsService.loading = true;
    this.projectsDTO.totalRecords = 0;
    this.projectsDTO.nametechnicalLeadId = project.technicalLeadId;
    this.projectsService.loading = true;
    this.projectsDTO.project.gate2 = null; this.projectsDTO.project.gate3 = null; this.projectsDTO.project.gate4 = null;
    this.projectsDTO.project.gate5 = null; this.projectsDTO.project.gate6 = null;
    if (this.projectsDTO.capabilityForm.dirty || this.projectsDTO.capabilityForm.valid ||
      this.projectsDTO.capabilityForm.controls['teamLead'].valid) {
      this.projectsDTO.nametechnicalLeadId = project.technicalLeadId;
      if (project.technicalLeadId) {
        project.technicalLeadId = this.projectsDTO.leadId;
      }
      project.projectTypeId = this.projectType.id;
      project.technologyId = localStorage.getItem('technology');
      this.projectsService.find(project).subscribe(result => {
        this.projectsService.loading = false;
        this.commonService.sendToggleFlag(true);

        this.projectsDTO.projectList = result.body.data;
        this.projectsDTO.projectList.forEach(projects => {
          this.technicalLeadFlyoutDTO.technicleTeam.forEach(lead => {
            if (lead.id === project.technicalLeadId) {
              projects.technicalLeadId = lead.firstName + ',' + lead.lastName;
            }
          });
        });
        this.projectsDTO.project.technicalLeadId = this.projectsDTO.nametechnicalLeadId;
        this.projectsDTO.totalRecords = this.projectsDTO.projectList.length;
        this.projectsDTO.projectDetail = this.projectsDTO.projectList.slice(0, this.projectsDTO.nOfRecordPage);
          this.notify.showSuccess(result.body.message);

      }, (error) => {
        this.projectsService.loading = true;
        this.projectsDTO.projectDetail = [];
        this.projectsDTO.totalRecords = 0;
        this.notify.showError(error.message);
      });
    } else {
      this.notify.showError('Please enter at least one field to search');
    }
  }
  onCasSelect(cas: any, pte: any) {
    const sum = Number(cas) + Number(pte);
    this.projectsDTO.project.ptePercent = 100 - Number(cas);
    this.projectsDTO.subErrorMsg = null;
    if (sum > 100) {
      this.projectsDTO.subErrorMsg = 'Sum of CAS and PTE can not be greater than 100';
    } else {
      this.projectsDTO.subErrorMsg = null;
    }
  }
  onPteSelect(cas: any, pte: any) {
    const sum = Number(cas) + Number(pte);
    this.projectsDTO.project.casPercent = 100 - Number(pte);
    this.projectsDTO.subErrorMsg = null;
    if (sum > 100) {
      this.projectsDTO.subErrorMsg = 'Sum of CAS and PTE can not be greater than 100';
    } else {
      this.projectsDTO.subErrorMsg = null;
    }
  }

  compareFn(c1: any, c2: any) {
    return (c1 && c2) && c1.id === c2.id;
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
    this.getTeamLeads();
    this.commonService.sendToggleFlag(true);

  }

  getTechnologies() {
    const technologyId = localStorage.getItem('technology');
    this.projectsDTO.project.technologyId = technologyId;
    this.technologyService.getAll().subscribe(result => {
      this.projectsDTO.technologyData = result.data;
      this.projectsDTO.technologyData = this.projectsDTO.technologyData.filter(technologyData =>
        technologyData.status === StatusEnum.Y && technologyData.id === technologyId);
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  pagenationChange(evt: any) {
    this.projectsDTO.nOfRecordPage = evt.rows;
    this.projectsDTO.projectDetail = this.projectsDTO.projectList.slice(evt.first, evt.first + this.projectsDTO.nOfRecordPage);
  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.projectsDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.projectsService.loading = true;

        this.dashboardService.showTechnologyHeader = true;
        this.projectsDTO.flag = true;
        this.getProject(this.projectType.id);
        this.getUOPSegment();
        this.getPPPriority();
        this.getStatus();
        this.getCurrentPhase();
        this.fileUploadFormControls();
        this.capabilityFormControls();
        this.getTeamLeads();
        this.getTechnologies();
        this.projectsDTO.uploadfile = this.projectsDTO.fileUploadForm.get('uploadfile') as any;
        this.projectsDTO.uploadfile.removeAt(0);
        this.projectsDTO.uploadfile = '';
        this.projectsDTO.nOfRecordPage = 10;
        this.technicalLeadFlyoutDTO.technicalnOfRecordPage = 10;
      }
    });
  }
}
