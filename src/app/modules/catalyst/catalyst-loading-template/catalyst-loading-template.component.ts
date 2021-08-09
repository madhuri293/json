import { Component, OnInit } from '@angular/core';
import { CatalystLoading, CatalystLoadingDTO } from './catalyst-loading.model';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CatalystLoadingTemplateService } from './catalyst-loading-template.service';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { DiluentService } from '../diluent/diluent.service';
import { CommonService } from '../../../shared/common-services/common.service';
import { TechnologyService } from '../../manage/technology/technology.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { Diluent } from '../diluent/diluent.model';
import { StatusEnum } from '../../../shared/enum/enum.model';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';


@Component({
  selector: 'app-catalyst-loading-template',
  templateUrl: './catalyst-loading-template.component.html'
})
export class CatalystLoadingTemplateComponent implements OnInit {
  catalystLoading = new CatalystLoading();
  catalystLoadingDTO: CatalystLoadingDTO = new CatalystLoadingDTO();
  diluent: Diluent = new Diluent();

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder, private router: ActivatedRoute, public catalystLoadingTemplateService: CatalystLoadingTemplateService,
    private notify: NotificationService, private diluentService: DiluentService,
    private technologyService: TechnologyService, private dashboardService: DashboadrdService) {
    this.catalystLoadingDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }
  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;

    this.catalystLoadingDTO.flag = true;
    this.catalystLoadingDTO.customizeflag = true;
    this.catalystLoadingDTO.nOfRecordPage = 10;
    this.catalystLoadingDTO.diluentnOfRecordPage = 10;
    this.catalystFormControls();
    this.diluentFormControls();
    this.getdiluent();
    this.getTechnology();
    this.catalystLoading.reactors.internalDiameter = 0.0117856;
    this.catalystLoading.reactors.catalystLoadingTemplateId = '';
    this.catalystLoading.status = '';
    this.updateBedVolume(0);
    this.getStatus();
    this.refresh();

    this.catalystLoadingDTO.cols = [
      { field: 'templateName', header: 'Template Name' },
      { field: '', header: 'Catalyst Volume' },
      { field: 'status', header: 'Status' },
    ];
  }
  units(data) {
    this.setLoading();

    if (data.length > 0) {
      this.getTemplateLoading();

    }
  }
  getStatus() {
    this.catalystLoadingDTO.statusList = this.commonService.getStatusList();
  }
  save(catalystLoadingData: any) {
    this.catalystLoadingDTO.isDisabled = true;
    catalystLoadingData.id = '';
    this.catalystLoading.beds = this.catalystLoadingDTO.customize.value;
    this.catalystLoading.reactors.internalDiameter = '0.0117856';
    this.catalystLoadingTemplateService.save(catalystLoadingData).subscribe(res => {
      this.catalystLoadingDTO.isDisabled = false;
      this.catalystLoadingDTO.totalRecords = 0;

      if (res) {
        this.onReset();

        this.notify.showSuccess(res.body.message);
      }
    }, (error) => {
      this.catalystLoadingDTO.isDisabled = false;
      this.notify.showError(error.message);
    });
  }
  onReset() {
    this.catalystLoadingDTO.isError = false;
    this.catalystLoadingDTO.totalRecords = 0;
    this.catalystLoadingTemplateService.loading = true;
    this.catalystLoadingDTO.isReset = '';
    this.catalystLoading.beds[0].volume = '';
    this.catalystLoading.beds[0].diluentVolume = '';
    this.catalystLoading.reactors.bedVolume = '';
    this.catalystLoading.reactors.bedLength = '';
    this.catalystLoadingDTO.formValid = false;
    this.catalystLoadingDTO.formValidForFind = false;
    this.catalystLoadingDTO.catalystForm.reset();
    this.catalystLoadingDTO.catalystForm.clearValidators();
    this.catalystLoading.reactors.internalDiameter = 0.0117856;
    (<FormArray>this.catalystLoadingDTO.catalystForm.get('customize')).controls = [];
    (<FormArray>this.catalystLoadingDTO.catalystForm.get('customize')).push(this.createItem());
    this.catalystLoadingDTO.customize.value = '';
    this.catalystLoadingDTO.flag = true;
    this.catalystLoadingDTO.customizeflag = true;
    this.getTechnology();
    this.catalystFormControls();

    this.diluent = new Diluent();
    this.catalystLoadingDTO.diluentForm.reset();
    this.getStatus();
    this.commonService.sendToggleFlag(true);

  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      bedNumber: ['', Validators.maxLength(20)],
      volume: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      split: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      diluentId: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      diluentVolume: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      diluentName: [''],
    });
  }
  addItem(): void {
    this.catalystLoadingTemplateService.loading = true;
    (<FormArray>this.catalystLoadingDTO.catalystForm.get('customize')).push(this.createItem());
    this.updateBedVolume(0);
    this.isFormValid();

  }
  remove(current_data: any) {
    this.catalystLoadingDTO.customize = this.catalystLoadingDTO.catalystForm.get('customize') as any;
    if (this.catalystLoadingDTO.customize.length > 1) {
      this.catalystLoadingDTO.customize.removeAt(current_data);
      this.updateBedVolume(0);
      this.isFormValid();
    }
  }
  catalystFormControls() {
    this.catalystLoadingDTO.catalystForm = this.formBuilder.group({
      technology: [''],
      templateName: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern(SPACE_REGEXP)])],
      status: ['', Validators.compose([Validators.required])],
      customize: this.formBuilder.array([this.createItem()]),
      internalDiameter: ['', Validators.maxLength(20)],
      bedLength: ['', Validators.maxLength(20)],
      bedVolume: ['', Validators.maxLength(20)]
    });
  }

  diluentFormControls() {
    this.catalystLoadingDTO.diluentForm = this.formBuilder.group({
      designation: [''],
      sourceName: [''],
      description: ['']
    });
  }

  getTechnology() {

    const technologyId = localStorage.getItem('technology');
    this.technologyService.getAll().subscribe(result => {
      this.catalystLoadingDTO.technologyList = result.data;
      this.catalystLoadingDTO.technologyList = this.catalystLoadingDTO.technologyList.filter(technologyData =>
        technologyData.status === StatusEnum.Y && technologyData.id === technologyId);
      this.catalystLoading.technologyId = technologyId;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  getdiluent() {
    this.catalystLoadingTemplateService.loading = true;
    this.diluent = new Diluent();
    this.diluentService.getAllActiveDiluent().subscribe(result => {
      this.catalystLoadingDTO.catalystdiluents = result.data.filter(val => val.status === StatusEnum.Y);
      this.catalystLoadingDTO.colsdiluents = [
        { field: 'diluentName', header: 'Diluent Designation' },
        { field: 'sourceName', header: 'Diluent Source' },
        { field: 'description', header: 'Description' },
      ];
      this.catalystLoadingDTO.diluenttotalRecords = this.catalystLoadingDTO.catalystdiluents.length;
      this.catalystLoadingDTO.numberOfRecords = this.catalystLoadingDTO.catalystdiluents.length;
      this.catalystLoadingDTO.diluentsDetail = this.catalystLoadingDTO.catalystdiluents
        .slice(0, this.catalystLoadingDTO.diluenttotalRecords);
      this.catalystLoadingTemplateService.loading = false;
    }, (error) => {
      this.catalystLoadingTemplateService.loading = false;
    });
  }
  getTemplateLoading() {

    this.catalystLoadingTemplateService.getTemplateLoading().subscribe(res => {
      this.catalystLoadingDTO.catalystList = res.data;

      this.catalystLoadingDTO.catalystList.forEach(result => {
        result.status = this.commonService.getStatusTemp(result);
      });
      this.catalystLoadingDTO.cols = [
        { field: 'templateName', header: 'Template Name' },
        { field: '', header: 'Catalyst Volume' },
        { field: 'status', header: 'Status' },
      ];
      if (this.catalystLoadingDTO.privilege) {
        this.catalystLoadingDTO.cols.push({ field: '', header: 'Action' });
      }
      this.catalystLoadingDTO.totalRecords = this.catalystLoadingDTO.catalystList.length;
      this.catalystLoadingDTO.numberOfRecords = this.catalystLoadingDTO.catalystList.length;
      setTimeout(() => {
        this.catalystLoadingTemplateService.loading = false;

      }, 5000)
    }, (err) => {
      this.catalystLoadingTemplateService.loading = false;
    });

  }
  deleteConfirmation(userdata: any) {
    this.catalystLoadingDTO.idToDelete = userdata.id;
    const sk = userdata.sk;
    this.commonService.modelConfirmation();
    this.commonService.configFlag.subscribe(flag => {
      if (flag) {
        this.catalystLoadingTemplateService.delete(this.catalystLoadingDTO.idToDelete, sk).subscribe(res => {
          this.onReset();
          this.notify.showSuccess(res.body.message);
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
      this.commonService.configFlag = new BehaviorSubject(false);
    });
  }
  catalystVolume(data: any, i: any) {
    this.catalystLoadingDTO.customize = this.catalystLoadingDTO.catalystForm.get('customize') as any;
    for (let s = 0; s <= this.catalystLoadingDTO.customize.value.length; s++) {
      if (i === s) {
        this.catalystLoadingDTO.customize.value[s].volume = data.baseValue;
      }
    }
    this.updateBedVolume(0);
  }
  diluentVolume(data: any, i: any) {
    this.catalystLoadingDTO.customize = this.catalystLoadingDTO.catalystForm.get('customize') as any;
    for (let s = 0; s <= this.catalystLoadingDTO.customize.value.length; s++) {
      if (i === s) {
        this.catalystLoadingDTO.customize.value[s].diluentVolume = data.baseValue;
      }
    }
    this.updateBedVolume(0);
  }
  splitChange(evt: any, i: any) {
    this.catalystLoadingDTO.customize = this.catalystLoadingDTO.catalystForm.get('customize') as any;
    if(evt.target.value === undefined || evt.target.value === ""){
      this.catalystLoadingDTO.isError = true;
      this.catalystLoadingDTO.errorIndex = i;
      this.catalystLoadingDTO.errorMessage = "The field is required";

    } else {
      this.catalystLoadingDTO.isError = false;

    }
    for (let s = 0; s <= this.catalystLoadingDTO.customize.value.length; s++) {
      if (i === s) {
        this.catalystLoadingDTO.customize.value[s].split = evt.target.value;
      }
    }
    this.updateBedVolume(0);
  }

  splitChange1(event,i){
if(event.target.value === ""){
  this.catalystLoadingDTO.isError = true;
  this.catalystLoadingDTO.errorIndex = i;
  this.catalystLoadingDTO.errorMessage = "The field is required";



}
  }
  Update(catalystTemplate: any) {
    this.catalystLoadingDTO.isDisabled = true;
    this.catalystLoadingTemplateService.update(catalystTemplate).subscribe(res => {
      this.catalystLoadingDTO.flag = true;
      this.catalystLoadingDTO.totalRecords = 0;

      if (res) {
        this.onReset();

        this.notify.showSuccess(res.body.message);
      }
      this.catalystLoadingDTO.isDisabled = false;
    }, (error) => {
      this.catalystLoadingDTO.isDisabled = false;
      this.notify.showError(error.message);
    });
  }
  updateBedVolume(event: any) {
    this.catalystLoadingDTO.customize = this.catalystLoadingDTO.catalystForm.get('customize') as any;
    this.catalystLoading.beds = this.catalystLoadingDTO.customize.value;

    if (this.catalystLoading.beds.length === 0) {
      this.catalystLoadingDTO.reactorBedLength = 0;
      this.catalystLoadingDTO.totalVolume = 0;
    }
    for (let i = 0; i < this.catalystLoading.beds.length; i++) {
      if (i === 0) {
        this.catalystLoadingDTO.totalVolume = 0;
      }
      this.catalystLoading.beds[i].bedNumber = i;
      this.catalystLoadingDTO.totalVolume = this.catalystLoadingDTO.totalVolume +
        (Number(this.catalystLoading.beds[i].volume) == null ? 0 : Number(this.catalystLoading.beds[i].volume)) +
        (Number(this.catalystLoading.beds[i].diluentVolume) == null ? 0 : Number(this.catalystLoading.beds[i].diluentVolume));
      // tslint:disable-next-line:max-line-length
      this.catalystLoadingDTO.reactorBedLength = (this.catalystLoadingDTO.totalVolume) / (3.14 * (Number(this.catalystLoading.reactors.internalDiameter) / 2) * (Number(this.catalystLoading.reactors.internalDiameter) / 2));
      if (this.catalystLoadingDTO.reactorBedLength === 0) {
        this.catalystLoading.reactors.bedLength = '';
      } else {
        this.catalystLoading.reactors.bedLength = this.catalystLoadingDTO.reactorBedLength + '';
      }
      if (this.catalystLoadingDTO.totalVolume === 0) {
        this.catalystLoading.reactors.bedVolume = '';
      } else {
        this.catalystLoading.reactors.bedVolume = this.catalystLoadingDTO.totalVolume + '';
      }
      this.catalystLoading.reactors.internalDiameter = this.catalystLoading.reactors.internalDiameter;
      // tslint:disable-next-line:max-line-length
    }
    this.catalystLoadingDTO.catalystForm.controls['bedLength'].setValue(this.catalystLoading.reactors.bedLength);
    this.catalystLoadingDTO.catalystForm.controls['bedVolume'].setValue(this.catalystLoading.reactors.bedVolume);
    this.catalystLoadingDTO.catalystForm.controls['internalDiameter'].setValue(this.catalystLoading.reactors.internalDiameter);
    this.catalystLoadingTemplateService.loading = false;
  }
  find(findcatalyst: any) {
    this.catalystLoadingTemplateService.loading = true;
    this.catalystLoadingDTO.totalRecords = 0;
    this.catalystLoading.reactors.internalDiameter = null;
    this.catalystLoadingTemplateService.find(findcatalyst).subscribe(res => {
      if (res) {
        this.catalystLoading.reactors.internalDiameter = 0.0117856;
        this.notify.showSuccess(res.body.message);
        this.commonService.sendToggleFlagFind(true);

        this.catalystLoadingDTO.catalystList = res.body.data;
        this.catalystLoadingDTO.catalystList.forEach(response => {
          response.status = this.commonService.getStatus(response);
        });
        this.catalystLoadingDTO.totalRecords = this.catalystLoadingDTO.catalystList.length;
        this.catalystLoadingDTO.catalysDetail = this.catalystLoadingDTO.catalystList.slice(0, this.catalystLoadingDTO.nOfRecordPage);
        this.catalystLoadingTemplateService.loading = false;
      } else {
        this.catalystLoadingTemplateService.loading = false;
        this.notify.showError(res.body.message);
      }
      this.catalystLoadingTemplateService.loading = false;
    }, (error) => {
      this.catalystLoading.reactors.internalDiameter = 0.0117856;
      this.catalystLoadingTemplateService.loading = false;
      this.catalystLoadingDTO.catalystList = null;
      this.notify.showError(error.message);
    });
  }
  diluentChange(data: any) {
    this.catalystLoadingDTO.diluentIndex = data;
    // this.catalystLoadingDTO.customize.value[this.catalystLoadingDTO.diluentIndex].diluentName = '';
    this.catalystLoadingDTO.customizeflag = false;
    this.getdiluent();
  }

  flyoutEdit(designation: any) {

    this.catalystLoadingDTO.customize = this.catalystLoadingDTO.catalystForm.get('customize') as any;
    for (let s = 0; s <= this.catalystLoadingDTO.customize.value.length; s++) {
      if (this.catalystLoadingDTO.diluentIndex === s) {
        this.catalystLoadingDTO.customize.value[s].diluentId = designation.id;
        this.catalystLoadingDTO.customize.value[s].diluentName = designation.diluentName;
      }
    }
    const flyoutModelClose = document.getElementById('flyoutModal');
    flyoutModelClose.click();
    this.isFormValid();

  }
  templateEdit(catalysttemplate: any) {
    this.catalystLoadingDTO.isDisabled = false;
    this.catalystLoadingDTO.flag = false;
    this.catalystLoadingDTO.formValid = true;
    this.catalystLoadingDTO.customizeflag = false;
    this.catalystLoadingTemplateService.loading = true;

    this.catalystLoadingTemplateService.catalystLoadingTemplategetByID(catalysttemplate.id).subscribe(res => {
      this.catalystLoading = res.data;
      if (this.catalystLoading.status !== "" && this.catalystLoading.templateName !== "") {
        this.catalystLoadingDTO.uomtemplate = true;
        this.catalystLoadingDTO.statuSelection = true;
        this.isFormValid();

      } else {
        this.catalystLoadingDTO.uomtemplate = false;
        this.catalystLoadingDTO.statuSelection = false;
      }
      this.catalystLoadingDTO.catalystForm.setControl('customize', this.setExitcustomize(this.catalystLoading.beds));
      this.bedsDataUpdate();
    });
    setTimeout(function () { this.catalystLoadingTemplateService.loading = false; }, 30000);

    this.catalystLoadingDTO.isReset = 'edit';

  }
  setExitcustomize(bedsData: any[]): FormArray {
    const formArray = new FormArray([]);
    bedsData.forEach(s => {
      this.catalystLoadingDTO.diluentsDetail.forEach(diluent => {
        if (diluent.id === s.diluentId) {
          formArray.push(this.formBuilder.group({
            bedNumber: s.bedNumber,
            catalystLoadingTemplateId: s.catalystLoadingTemplateId,
            volume: s.volume,
            split: s.split,
            diluentId: s.diluentId,
            diluentName: diluent.diluentName,
            diluentVolume: s.diluentVolume
          }));
        }

      });

    });
    this.catalystLoadingDTO.arraylist = bedsData;
    return formArray;

  }
  bedsDataUpdate() {
    for (var b = 0; b < this.catalystLoadingDTO.arraylist.length; b++) {

      this.catalystLoading.beds[b].volume = this.catalystLoadingDTO.arraylist[b].volume;
      this.catalystLoading.beds[b].diluentVolume = this.catalystLoadingDTO.arraylist[b].diluentVolume;

    }
  }


  templateNameEvent(evt: any) {
    if (evt.target.value !== '') {
      this.catalystLoadingDTO.uomtemplate = true;
      this.isFormValid();
    } else {
      this.catalystLoadingDTO.uomtemplate = false;
      this.isFormValid();
    }
  }
  statusSelect(evt: any) {
    this.catalystLoadingDTO.statuSelection = true;
    this.isFormValid();
  }

  isFormValid() {
    if (this.catalystLoadingDTO.uomtemplate === true && this.catalystLoadingDTO.statuSelection === true) {
      this.catalystLoadingDTO.customize = this.catalystLoadingDTO.catalystForm.get('customize') as any;
      for (let i = 0; i < this.catalystLoadingDTO.customize.value.length; i++) {
        this.catalystLoadingDTO.formValid = false;
        // tslint:disable-next-line: max-line-length
        if (this.catalystLoadingDTO.customize.value[i].volume &&
          this.catalystLoadingDTO.customize.value[i].diluentId && this.catalystLoadingDTO.customize.value[i].diluentName !== "" &&
          this.catalystLoadingDTO.customize.value[i].diluentVolume && this.catalystLoadingDTO.customize.value[i].split)
        // tslint:disable-next-line: max-line-length
        {
          this.catalystLoadingDTO.formValid = true;
        } else {
          this.catalystLoadingDTO.formValid = false;
          break;
        }
      }
    } else {
      this.catalystLoadingDTO.formValid = false;
    }
  }
  formEnableForFind() {
    this.catalystLoadingDTO.customize = this.catalystLoadingDTO.catalystForm.get('customize') as any;
    for (let i = 0; i < this.catalystLoadingDTO.customize.value.length; i++) {
      this.catalystLoadingDTO.formValidForFind = false;
      // tslint:disable-next-line: max-line-length
      if (this.catalystLoadingDTO.customize.value[i].volume ||
        this.catalystLoadingDTO.customize.value[i].diluentId || this.catalystLoadingDTO.customize.value[i].diluentName !== "" ||
        this.catalystLoadingDTO.customize.value[i].diluentVolume || this.catalystLoadingDTO.customize.value[i].split)
      // tslint:disable-next-line: max-line-length
      {
        this.catalystLoadingDTO.formValidForFind = true;
      } else {
        this.catalystLoadingDTO.formValidForFind = false;
        break;
      }
    }
  }
  internalDiameter(value: any) { }
  onDiluentFind(data: any) {
    this.catalystLoadingTemplateService.loading = true;
    this.diluentService.findActive(data).subscribe(res => {
      this.commonService.sendToggleFlagFind(true);
      this.catalystLoadingTemplateService.loading = false;
      this.catalystLoadingDTO.catalystdiluents = res.body.data;
      this.catalystLoadingDTO.diluenttotalRecords = this.catalystLoadingDTO.catalystdiluents.length;
      this.notify.showSuccess(res.body.message);

    }, (error) => {
      this.catalystLoadingTemplateService.loading = false;
      this.catalystLoadingDTO.diluenttotalRecords = 0;
      this.notify.showError(error.message);
    });
  }

  flyoutReset() {
    this.diluent = new Diluent();
    this.catalystLoadingDTO.diluentForm.reset();
    this.getdiluent();
    this.commonService.sendToggleFlagFind(true);

  }
  get formArray(): FormArray {
    return this.catalystLoadingDTO.catalystForm.get('customize') as FormArray;
  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.catalystLoadingDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.catalystLoadingTemplateService.loading = true;
        this.catalystLoadingDTO.flag = true;
        this.catalystLoadingDTO.customizeflag = true;
        this.catalystLoadingDTO.nOfRecordPage = 10;
        this.catalystLoadingDTO.diluentnOfRecordPage = 10;
        this.catalystFormControls();
        this.diluentFormControls();
        this.getdiluent();
        this.getTechnology();
        this.catalystLoading.reactors.internalDiameter = 0.0117856;
        this.catalystLoading.reactors.catalystLoadingTemplateId = '';
        this.catalystLoading.status = '';
        this.updateBedVolume(0);
        this.getStatus();
      }
    })
  }

  setLoading() {
    this.catalystLoadingTemplateService.loading = true;
  }


  preventNonNumericalInput(evt: any) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    const number = evt.target.value.split('.');
    if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    if (number.length > 1 && charCode === 46) {
      return false;
    }
  }
}

