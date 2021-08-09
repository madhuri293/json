import { Component, OnInit, Input } from '@angular/core';
import { Project,  ProjectType, Files, ProjectsDTO, TechnicalLeadFlyoutDTO } from '../projects.model';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { ProjectsService } from '../projects.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UserService } from '../../manage/user/user.service';
import { User } from '../../manage/user/user.model';
import { TechnologyService } from '../../manage/technology/technology.service';
import { SPACE_REGEXP, DESC_SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { BehaviorSubject } from 'rxjs';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, ProjectsEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-npd',
  templateUrl: './npd.component.html'
})
export class NpdComponent implements OnInit {
  @Input() projectType: ProjectType;
  projectsDTO: ProjectsDTO = new ProjectsDTO();
  technicalLeadFlyoutDTO: TechnicalLeadFlyoutDTO = new TechnicalLeadFlyoutDTO();
  get tomorrowDate(): Date {
    const todayDate = new Date();
    const tomorrowDate = new Date(todayDate.getTime() + 24 * 60 * 60 * 1000);
    return tomorrowDate;
  }

  constructor(public projectsService: ProjectsService,
    private notify: NotificationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private technologyService: TechnologyService,
    private commonService: CommonService,
    private bsModalService: BsModalService,
    private router: ActivatedRoute,
    private dashboardService: DashboadrdService

  ) {
    this.projectsDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }
  ngOnInit() {
    this.refresh();
    this.dashboardService.showTechnologyHeader = true;

    this.projectsDTO.maxDate = new Date();
    this.projectsDTO.myDatePickerOptions = {
      dateFormat: 'dd-mm-yyyy',
      disableSince: { year: this.tomorrowDate.getFullYear(), month: this.tomorrowDate.getMonth() + 1, day: this.tomorrowDate.getDate() }
    };
    const inputs = document.querySelectorAll('.file-input');

    for (let i = 0, len = inputs.length; i < len; i++) {
      this.customInput(inputs[i]);
    }
    this.projectsDTO.nOfRecordPage = 10;
    this.projectFormControls();
    this.fileUploadFormControls();
    this.getTechnologies();
    this.getProjects();
    this.getCurrentPhase();
    this.getCurrentPhasName();
    this.getPpPriority();
    this.getStatus();
    this.getUopSeg();
    this.flyOutFormControls();
    this.getLead();
    this.projectsDTO.files = this.projectsDTO.fileUploadForm.get('uploadData') as FormArray;
    this.projectsDTO.files.removeAt(0);

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


  projectFormControls() {
    this.projectsDTO.projectForm = this.formBuilder.group({
      projectName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255),
      Validators.pattern(SPACE_REGEXP)])),
      currentPhasePriority: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      technicalTeamLead: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      technologyCode: new FormControl('', Validators.compose([Validators.maxLength(255)])),
      networkNumber1: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP),
      Validators.maxLength(255)])),
      networkNumber2: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP),
      Validators.maxLength(255)])),
      networkNumber3: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP),
      Validators.maxLength(255)])),
      UOPSEG: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      currentPhaseName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      ppPriority: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      description: new FormControl('', Validators.compose([Validators.required, Validators.pattern(DESC_SPACE_REGEXP),
      Validators.maxLength(255)])),
      status: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      cas: new FormControl('', Validators.compose([Validators.required])),
      pte: new FormControl('', Validators.compose([Validators.required])),
      gate2: new FormControl(''),
      gate3: new FormControl(''),
      gate4: new FormControl(''),
      gate5: new FormControl(''),
      gate6: new FormControl(''),

    });
  }

  flyOutFormControls() {
    this.technicalLeadFlyoutDTO.flyOutForm = this.formBuilder.group({
      eId: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
    });
  }

  onClick() {
    console.log( this.technicalLeadFlyoutDTO.user);
    this.technicalLeadFlyoutDTO.flyOutForm.reset();
    // this.technicalLeadFlyoutDTO.user = new User();
    
    this.technicalLeadFlyoutDTO.flyOutPopUp = true;
  }
  getLead(){
    this.projectsService.loading = true;
    this.userService.getTechnicalTeamLead().subscribe(result => {
      this.technicalLeadFlyoutDTO.technicalTeamLeadList = result.data;
      this.technicalLeadFlyoutDTO.fluOutnOfRecordPage = 10;
      this.technicalLeadFlyoutDTO.flyOutTotalRecords = this.technicalLeadFlyoutDTO.technicalTeamLeadList.length;
      this.technicalLeadFlyoutDTO.flyOutcols = [
        { field: 'eId', header: 'Eid' },
        { field: 'firstName', header: 'First Name' },
        { field: 'lastName', header: 'Last Name' },
        { field: 'email', header: 'Email' }
      ];
      this.projectsService.loading = false;
     
    }, (error) => {
      this.projectsService.loading = false;
    });
  }
  fileUploadFormControls() {
    this.projectsDTO.fileUploadForm = this.formBuilder.group({
      uploadData: this.formBuilder.array([this.createFileData()])
    });
  }
  createFileData(): FormGroup {
    return this.formBuilder.group({
      description: new FormControl('', Validators.compose([Validators.maxLength(500)])),
      name: new FormControl()
    });
  }
  remove(index: any) {
    this.projectsDTO.allFileSize.splice(index, 1);
    this.projectsDTO.fileNameArray.splice(index, 1);
    this.projectsDTO.fileContent.splice(index, 1);
    this.projectsDTO.fileTypeArray.splice(index, 1);
    this.projectsDTO.files.removeAt(index);
    this.projectsDTO.projectFilesArray.splice(index, 1);
    this.projectsDTO.fileArray.splice(index, 1);
  }
  addFileData() {
    this.projectsDTO.files = this.projectsDTO.fileUploadForm.get('uploadData') as FormArray;
    this.projectsDTO.files.push(this.createFileData());
  }

  getCurrentPhase() {
    this.projectsService.getCurrentPhase().subscribe(result => {
      this.projectsDTO.currentPhaseList = result.data;
    });
  }

  getCurrentPhasName() {
    this.projectsService.getCurrentPhaseName().subscribe(result => {
      this.projectsDTO.currentPhaseNameList = result.data;
    });
  }

  getPpPriority() {
    this.projectsService.getPPPriority().subscribe(result => {
      this.projectsDTO.currentPhasePriority = result.data;
    });
  }

  getStatus() {
    this.projectsService.getStatus().subscribe(result => {
      this.projectsDTO.statusList = result.data;
    });
  }

  getUopSeg() {
    this.projectsService.getUopSegment().subscribe(result => {
      this.projectsDTO.uopSegment = result.data;
    });
  }

  get formArray() {
    const formArray = this.projectsDTO.fileUploadForm.get('uploadData') as FormArray;
    return formArray;
  }

  onUploadClick(event: any, i: number, fileData: any) {
    const fileNameList = event.target.files[0].name.split('.');
    const fileName = event.target.files[0].name.split('.')[fileNameList.length - 1];
    if (fileName !== ProjectsEnum.PDF && fileName !== ProjectsEnum.PPTX && fileName !== ProjectsEnum.TXT && fileName !== ProjectsEnum.JPEG
      && fileName !== ProjectsEnum.XLSX && fileName !== ProjectsEnum.csv && fileName !== ProjectsEnum.XLS && fileName !== ProjectsEnum.DOCX
      && fileName !== ProjectsEnum.DOC && fileName !== ProjectsEnum.JPG &&
      fileName !== ProjectsEnum.JFIF && fileName !== ProjectsEnum.JPE) {
      this.notify.showWarning('File format not supported');
    } else {
      const size = (event.target.files[0].size / 1000) - 200;
      if (size > 6000) {
        this.notify.showWarning('File size can not be greater than 6MB');
      } else {
        this.projectsDTO.fileSizeErrorMessage = null;
        const reader = new FileReader();
        this.projectsDTO.files = this.projectsDTO.fileUploadForm.get('uploadData') as FormArray;
        if (this.projectsDTO.fileArray.length > i) {
          const file: File = event.target.files[0];
          reader.readAsDataURL(file);
          this.projectsDTO.filesObj = new Files();
          this.projectsDTO.filesObj.contentType = file.type;
          this.projectsDTO.allFileSize.push(file.size / (1000));
          this.projectsDTO.totalFileSize.push(file.size / (1000));
          this.projectsDTO.filesObj.fileSize = file.size / (1000) + ProjectsEnum.KB;
          this.projectsDTO.filesObj.fileName = file.name;
          reader.onload = () => {
            const value = (reader.result as string).split(',')[1];
            this.projectsDTO.filesObj.fileStream = value;
            this.projectsDTO.projectFilesArray.splice(i, 1);
            this.projectsDTO.fileArray.slice(i, 1);
            this.projectsDTO.fileArray[i] = this.projectsDTO.filesObj;
            this.projectsDTO.loading = false;
          };
          this.projectsDTO.fileArray.push(this.projectsDTO.filesObj);
          this.projectsDTO.fileArray.splice(this.projectsDTO.fileArray.length - 1);
        } else {
          this.projectsDTO.loading = true;
          const file: File = event.target.files[0];
          this.projectsDTO.filesObj = new Files();
          this.projectsDTO.filesObj.contentType = file.type;
          this.projectsDTO.allFileSize.push(file.size / (1000));
          this.projectsDTO.totalFileSize.push(file.size / (1000));
          this.projectsDTO.filesObj.fileSize = file.size / (1000) + ProjectsEnum.KB;
          this.projectsDTO.filesObj.fileName = file.name;
           reader.readAsDataURL(file);
           reader.onload = () => {
            const  value =  (reader.result as string).split(',')[1];
            this.projectsDTO.filesObj.fileStream = value;
            this.projectsDTO.projectFilesArray.splice(i, 1);
            this.projectsDTO.loading = false;
          };
          this.projectsDTO.fileArray.push(this.projectsDTO.filesObj);
        }
      }
      this.projectsDTO.fileSize = 0;
      this.projectsDTO.totalFileSize.forEach(data => {
        this.projectsDTO.fileSize += data;
      });
    }
  }

  onDeleteClick(data: any) {
    this.projectsService.delete(data.id, data.id).subscribe(result => {
      this.notify.showSuccess(result.body.message);
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  onEditClick(data: any) {
    this.projectsDTO.isDisabled = false;
    this.projectsDTO.fileArray = [];
    this.projectsService.getProjectById(data.id).subscribe(result => {
      this.projectsDTO.project = result.data;
      this.projectsDTO.leadId = result.data.technicalLeadId;
      this.userService.getById(this.projectsDTO.leadId).subscribe(user => {
        result.data.technicalLeadId = user.data.firstName + ',' + user.data.lastName;
        this.projectsDTO.selectedLeadName = result.data.technicalLeadId;
      });
      if (this.projectsDTO.project.projectDocuments) {
        this.projectsDTO.projectFilesArray = this.projectsDTO.project.projectDocuments;
      }
      if (this.projectsDTO.project.projectGates[0]) {
        this.projectsDTO.project.gate2 = this.projectsDTO.project.projectGates[0];
        if (this.projectsDTO.project.gate2.gateDate) {
          this.projectsDTO.project.gate2.gateDate = new Date(this.projectsDTO.project.gate2.gateDate);
        }
      } else {
        this.projectsDTO.project.gate2 = new Project().gate2;
      }
      if (this.projectsDTO.project.projectGates[1]) {
        this.projectsDTO.project.gate3 = this.projectsDTO.project.projectGates[1];
        if (this.projectsDTO.project.gate3.gateDate) {
          this.projectsDTO.project.gate3.gateDate = new Date(this.projectsDTO.project.gate3.gateDate);
        }

      } else {
        this.projectsDTO.project.gate3 = new Project().gate3;
      }
      if (this.projectsDTO.project.projectGates[2]) {
        this.projectsDTO.project.gate4 = this.projectsDTO.project.projectGates[2];
        if (this.projectsDTO.project.gate4.gateDate) {
          this.projectsDTO.project.gate4.gateDate = new Date(this.projectsDTO.project.gate4.gateDate);
        }

      } else {
        this.projectsDTO.project.gate4 = new Project().gate4;
      }
      if (this.projectsDTO.project.projectGates[3]) {
        this.projectsDTO.project.gate5 = this.projectsDTO.project.projectGates[3];
        if (this.projectsDTO.project.gate5.gateDate) {
          this.projectsDTO.project.gate5.gateDate = new Date(this.projectsDTO.project.gate5.gateDate);
        }

      } else {
        this.projectsDTO.project.gate5 = new Project().gate5;
      }
      if (this.projectsDTO.project.projectGates[4]) {
        this.projectsDTO.project.gate6 = this.projectsDTO.project.projectGates[4];
        if (this.projectsDTO.project.gate6.gateDate) {
          this.projectsDTO.project.gate6.gateDate = new Date(this.projectsDTO.project.gate6.gateDate);
        }

      } else {
        this.projectsDTO.project.gate6 = new Project().gate6;
      }

      while (this.projectsDTO.files.length !== 0) {
        this.projectsDTO.files.removeAt(0);
      }
      if (this.projectsDTO.project.projectDocuments) {
        for (let i = 0; i < this.projectsDTO.project.projectDocuments.length; i++) {
          this.addFileData();
        }
        this.projectsDTO.project.projectDocuments.forEach((val, i) => {
          this.projectsDTO.fileArray.push(val);
          const filesArray = this.projectsDTO.fileUploadForm.get('uploadData') as FormArray;
          filesArray.controls[i].patchValue({ description: val.fileDescription });
        });

      }
    }, (error) => {
      this.notify.showError(error.message);
    });
  }

  save(project: any) {
    this.projectsService.loading = true;
    this.projectsDTO.isDisabled = true;
    this.projectsDTO.project.technicalLeadId = this.projectsDTO.leadId;
    this.projectsDTO.disableSave = false;
    while (project.projectGates.length !== 0) {
      project.projectGates.pop();
    }
    this.projectsDTO.project.projectDocuments = this.projectsDTO.fileArray;
    this.projectsDTO.fileSizeErrorMessage = null;
    let uploadArray;
    uploadArray = this.projectsDTO.fileUploadForm.get('uploadData').value;
    this.projectsDTO.project.projectDocuments = this.projectsDTO.fileArray;
    this.projectsDTO.fileSizeErrorMessage = null;
    this.projectsDTO.project.projectDocuments.forEach((file, i) => {
      file.fileDescription = uploadArray[i].description;
    });
    this.projectsDTO.project.projectTypeId = this.projectType.id;
    this.projectsDTO.allFileSize.forEach(data => {
      this.projectsDTO.fileSize += data;
    });
    project.projectGates.push(project.gate2);
    project.projectGates.push(project.gate3);
    project.projectGates.push(project.gate4);
    project.projectGates.push(project.gate5);
    project.projectGates.push(project.gate6);
    project.projectFiles = this.projectsDTO.project.projectDocuments;
    this.projectsDTO.fileSizeErrorMessage = null;
    delete project.projectFiles;
    if (project.id) {
      this.projectsService.update(project).subscribe(result => {
        this.reset();
        this.projectsDTO.isDisabled = false;
        this.projectsService.loading = false;
        this.notify.showSuccess(result.body.message);
      },
        error => {
          this.projectsDTO.isDisabled = false;
          this.projectsService.loading = false;
          this.notify.showError(error.message);
          this.projectsDTO.project.technicalLeadId = this.projectsDTO.selectedLeadName;
        }
      );
    } else {
      this.projectsService.save(project).subscribe(result => {
        this.reset();
        this.projectsDTO.isDisabled = false;
        this.projectsService.loading = false;
        this.notify.showSuccess(result.body.message);
      }, error => {
        this.projectsDTO.isDisabled = false;
        this.projectsService.loading = false;
        this.projectsDTO.project.technicalLeadId = this.projectsDTO.selectedLeadName;
        this.notify.showError(error.message);
      });
    }
    while (this.projectsDTO.totalFileSize.length !== 0) {
      this.projectsDTO.totalFileSize.pop();
      this.projectsDTO.fileSize = 0;
    }
  }

  reset() {
    this.getProjects();
    this.projectsDTO.project = new Project();
    this.projectsDTO.projectForm.reset();
    this.projectsDTO.fileUploadForm.reset();
    this.projectsDTO.fileUploadForm.get('uploadData').reset();
    this.projectsDTO.fileArray = [];
    this.commonService.sendToggleFlag(true);

    this.getTechnologies();
    while (this.projectsDTO.files.length !== 0) {
      this.projectsDTO.files.removeAt(0);
    }
    while (this.projectsDTO.totalFileSize.length !== 0) {
      this.projectsDTO.totalFileSize.pop();
      this.projectsDTO.fileSize = 0;
    }
    this.technicalLeadFlyoutDTO.user = new User();
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

  getProjects() {
     this.projectsService.loading = true;
    this.projectsService.getProjectListByProjectType(this.projectType.id).subscribe(result => {
      this.projectsDTO.projectRecord = result.data;
      this.projectsDTO.totalRecords = this.projectsDTO.projectRecord.length;
      this.projectsDTO.cols = [{ field: 'projectName', header: 'Project Name' },
      { field: 'currentPhasePriorityName', header: 'Current Phase Priority' },
      { field: 'technicalLeadName', header: 'Technichal Team Lead' },
      { field: 'ppPriorityName', header: 'PP Priority' },
      { field: 'projectStatusName', header: 'Status' }
      ];
      if (this.projectsDTO.privilege) {
        this.projectsDTO.cols.push({ field: 'Action', header: 'Action' });
      }
      this.projectsService.loading = false;
    },
      (error) => {
        this.projectsDTO.totalRecords = 0;
        this.projectsService.loading = false;
      });
  }

  onUopSegmentSelection(data: any) {
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
  find(project: any) {
    this.projectsDTO.totalRecords = 0;
    this.projectsService.loading = true;
    project.projectGates = new Array();
    if (this.projectsDTO.projectForm.dirty || this.projectsDTO.projectForm.valid
      || this.projectsDTO.projectForm.controls['technicalTeamLead'].valid) {
      this.projectsDTO.nametechnicalLeadId = project.technicalLeadId;
      this.projectsDTO.project.technicalLeadId = project.technicalLeadId;
      if (project.technicalLeadId) {
        project.technicalLeadId = this.projectsDTO.leadId;
      }
      project.projectTypeId = this.projectType.id;
      project.projectGates.push(project.gate2);
      project.projectGates.push(project.gate3);
      project.projectGates.push(project.gate4);
      project.projectGates.push(project.gate5);
      project.projectGates.push(project.gate6);
      this.projectsService.find(project).subscribe(result => {
        this.projectsDTO.project.technicalLeadId = this.projectsDTO.nametechnicalLeadId;
        this.commonService.sendToggleFlag(true);

        this.projectsDTO.projectRecord = result.body.data;
        this.projectsDTO.totalRecords = this.projectsDTO.projectRecord.length;
        this.projectsService.loading = false;
          this.notify.showSuccess(result.body.message);
      }, (error) => {
        this.projectsService.loading = false;
        this.projectsDTO.projectsList = [];
        this.projectsDTO.totalRecords = 0;
        this.notify.showError(error.message);
      }
      );
    } else {
      this.notify.showError('Enter at least one field to search');
    }
  }

  flyOutFind(user: any) {
    if (this.technicalLeadFlyoutDTO.flyOutForm.dirty || this.technicalLeadFlyoutDTO.flyOutForm.valid) {
      this.userService.findTeamLead(user).subscribe(result => {
        this.technicalLeadFlyoutDTO.technicalTeamLeadList = result.body.data;
        this.commonService.sendToggleFlag(true);

        this.technicalLeadFlyoutDTO.flyOutTotalRecords = this.technicalLeadFlyoutDTO.technicalTeamLeadList.length;
         this.notify.showSuccess(result.body.message);
      }, (error) => {
        this.technicalLeadFlyoutDTO.technicalTeamLeadList = null;
        this.notify.showError(error.message);
      });
    } else {
      this.notify.showError('Enter at least one filed to search');
    }

  }
  onCustomerClick(evt: any) {
    this.technicalLeadFlyoutDTO.user = evt;
    this.projectsDTO.leadId = this.technicalLeadFlyoutDTO.user.id;
    this.projectsDTO.project.technicalLeadId = this.technicalLeadFlyoutDTO.user.firstName + ',' + this.technicalLeadFlyoutDTO.user.lastName;
    this.projectsDTO.selectedLeadName = this.technicalLeadFlyoutDTO.user.firstName + ',' + this.technicalLeadFlyoutDTO.user.lastName;
    // this.technicalLeadFlyoutDTO.user = evt;
    console.log(evt, this.technicalLeadFlyoutDTO.user);
    const flyoutModelClose = document.getElementById('flyoutModal');
    flyoutModelClose.click();
    // this.technicalLeadFlyoutDTO.flyOutForm.reset();
  }


  downloadFile(data: any) {
    if (data.id) {
      window.open(data.filePath);
    } else {
      this.notify.showWarning('save the file to download');
    }


  }

  deleteConfirmation(project: any) {
    this.projectsDTO.projectId = project.id;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.projectsService.loading = true;
        const sk = project.sk;
        this.projectsService.delete(this.projectsDTO.projectId, sk).subscribe(res => {
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
  refresh(){
    this.commonService.loadComponent.subscribe(flag =>{
      if(flag){
    this.projectsDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
    this.dashboardService.showTechnologyHeader = true;
    this.projectsService.loading = true;

    this.projectsDTO.maxDate = new Date();
    this.projectsDTO.myDatePickerOptions = {
      dateFormat: 'dd-mm-yyyy',
      disableSince: { year: this.tomorrowDate.getFullYear(), month: this.tomorrowDate.getMonth() + 1, day: this.tomorrowDate.getDate() }
    };
    const inputs = document.querySelectorAll('.file-input');

    for (let i = 0, len = inputs.length; i < len; i++) {
      this.customInput(inputs[i]);
    }
    this.projectsDTO.nOfRecordPage = 10;
    this.projectFormControls();
    this.fileUploadFormControls();
    this.getTechnologies();
    this.getProjects();
    this.getCurrentPhase();
    this.getCurrentPhasName();
    this.getPpPriority();
    this.getStatus();
    this.getUopSeg();
    this.projectsDTO.files = this.projectsDTO.fileUploadForm.get('uploadData') as FormArray;
    this.projectsDTO.files.removeAt(0);
  }
  });

  }
  flyoutFormReset() {
    this.technicalLeadFlyoutDTO.flyOutForm.reset();
    this.getLead();
    this.commonService.sendToggleFlag(true);

  }

}

