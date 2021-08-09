import { Component, OnInit } from '@angular/core';
import {
  CatalystMainMasters, FlyoutCatalystFamilyDTO,
  FlyoutCatalystLeaderDTO, CatalystMainMastersDTO
} from './catalyst-main-masters.model';
import { CatalystMainMastersService } from './catalyst-main-masters.service';
import { BehaviorSubject } from 'rxjs';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { CatalystAliasService } from '../catalyst-alias-ss/catalyst-alias.service';
import { CatalystFamilyService } from '../catalyst-family/catalyst-family.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { CatalystShapeService } from '../catalyst-shape/catalyst-shape.service';
import { CatalystSizeService } from '../catalyst-size/catalyst-size.service';
import { UserService } from '../../manage/user/user.service';
import { CatalystScaleService } from '../catalyst-scale/catalyst-scale.service';
import { User } from '../../manage/user/user.model';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { StatusEnum, DeleteMessageEnum, CheckBoxNumber, ValueType } from '../../../shared/enum/enum.model';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { TechnologyService } from '../../manage/technology/technology.service';
import { CatalystFamily } from '../catalyst-family/catalyst-family.model';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { ActivatedRoute } from '@angular/router';


export interface Aliaslist {
  aliaslistname: string;
}
@Component({
  selector: 'app-catalyst-main-masters',
  templateUrl: './catalyst-main-masters.component.html'
})
export class CatalystMainMastersComponent implements OnInit {
  catalystMainMasters = new CatalystMainMasters();
  catalystMainMastersDTO: CatalystMainMastersDTO = new CatalystMainMastersDTO();
  flyoutCatalystFamilyDTO: FlyoutCatalystFamilyDTO = new FlyoutCatalystFamilyDTO();
  flyoutCatalystLeaderDTO: FlyoutCatalystLeaderDTO = new FlyoutCatalystLeaderDTO();
  user: User = new User();
  catalystFamily: CatalystFamily = new CatalystFamily();

  constructor(private formBuilder: FormBuilder, public catalystMainMastersService: CatalystMainMastersService,
    private _catalystAliasService: CatalystAliasService, private catalystFamilyService: CatalystFamilyService,
    private notify: NotificationService, private catalystShapeService: CatalystShapeService, public router: ActivatedRoute,
    private catalystSizeService: CatalystSizeService, public userService: UserService, private catalystScaleService: CatalystScaleService,
    private commonService: CommonService, private bsModalService: BsModalService,
    private technologyService: TechnologyService, private dashboardService: DashboadrdService
  ) {
    this.catalystMainMastersDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }
  ngOnInit() {
    this.refresh();
    this.catalystMainMastersDTO.uomFlag = false;
    this.dashboardService.showTechnologyHeader = true;
    this.catalystMainMastersService.loading = true;
    this.catalystMainMastersDTO.limsSampleIdArray = [];
    this.catalystMainMastersDTO.flag = true;
    this.catalystMainMastersDTO.nOfRecordPage = 10;
    this.flyoutCatalystFamilyDTO.catalystfamilynOfRecordPage = 10;
    this.flyoutCatalystLeaderDTO.catalystLeadernOfRecordPage = 10;
    this.getTechnologies();
    this.getAllalias();
    this.getStates();
    this.getcatalystScale();
    this.catalystFormControls();
    this.teamLeadFormControls();
    this.catalystFamilyFormControls();

    this.catalystMainMastersDTO.cols = [
      { field: 'designationName', header: 'Designation' },
      { field: 'commercialFamilyName', header: 'Catalyst Family' },

      { field: 'programFamilyName', header: 'Program Family' },

      { field: 'catalystTypeName', header: 'Type' },
      { field: 'catalystShapeName', header: 'Shape' },
      { field: 'catalystSizeCode', header: 'Size' },
      { field: 'catalystStateName', header: 'States' }
    ];

    if (this.catalystMainMastersDTO.privilege) {
      this.catalystMainMastersDTO.cols.push({ field: '', header: 'Action' });
    }
    this.catalystMainMastersService.loading = true;

  }
  units(data) {
    if (data.length > 0) {
      this.getCatalystMain();

    }
  }

  getTechnologies() {
    const selectedTechnology = localStorage.getItem('technology');
    this.catalystMainMasters.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.catalystMainMastersDTO.technology = result.data;
      // tslint:disable-next-line:max-line-length
      this.catalystMainMastersDTO.technology = this.catalystMainMastersDTO.technology.filter(tech => tech.technologyId === selectedTechnology);
      this.catalystMainMastersDTO.technology = this.catalystMainMastersDTO.technology.filter(val => val.status === StatusEnum.Y);
    }, error => {
      this.notify.showError(error.message);
    });
  }
  leadreset() {
    this.flyoutCatalystLeaderDTO.teamLeadForm = this.formBuilder.group({
      firstName: [''],
      eId: ['']
    });
  }
  formReset() {
    this.flyoutCatalystFamilyDTO.catalystFamilyForm.reset();
  }
  leaderFormReset() {
    this.flyoutCatalystLeaderDTO.teamLeadForm.reset();
  }
  catalystFirstNamechange(data) {
    this.user.firstName = data;
  }
  catalysteIdchange(data) {
    this.user.eId = data;
  }
  getAllalias() {
    this._catalystAliasService.getAllActiveCatalystAlias().subscribe((res: any) => {
      this.catalystMainMastersDTO.aliaslist = res.data;
    });
  }
  getStates() {
    this.catalystMainMastersService.getActiveStates((res: any) => {
      this.catalystMainMastersDTO.stateslist = res.data;
    });
  }
  getcatalystScale() {

    this.catalystScaleService.getAllCatalystScaleActive().subscribe(result => {

      this.catalystMainMastersDTO.catalystscale = result.data;

    });
  }

  teamLeadFormControls() {
    this.flyoutCatalystLeaderDTO.teamLeadForm = this.formBuilder.group(
      {
        firstName: new FormControl(''),
        eId: new FormControl('')
      }
    );

  }
  catalystFamilyFormControls() {
    this.flyoutCatalystFamilyDTO.catalystFamilyForm = this.formBuilder.group(
      {
        catalystFamilyName: new FormControl('')
      }
    );
  }
  resetTeamLeadForm() {
    this.user = new User();
    this.catalystMainMasters.userId = '';
    this.flyoutCatalystLeaderDTO.teamLeadForm.reset();
    this.getLeader();
    this.commonService.sendToggleFlagFind(true);

  }
  resetcatalystFamilyForm() {
    this.catalystFamily = new CatalystFamily();
    this.catalystMainMasters.commercialFamilyName = '';
    this.catalystMainMasters.catalystTypeName = '';
    this.flyoutCatalystFamilyDTO.catalystFamilyForm.reset();
    this.getFamily();
    this.commonService.sendToggleFlagFind(true);

  }

  getFamily() {
    this.catalystMainMastersService.loading = true;
    this.catalystFamilyService.getAllActiveCatalystFamily().subscribe((res: any) => {
      this.catalystMainMastersDTO.catalystListfamily = res.data.filter(family => family.status === StatusEnum.Y);
      this.catalystMainMastersService.loading = false;
      this.flyoutCatalystFamilyDTO.familycols = [
        { field: 'commercialFamilyName', header: 'Commercial Family Name' },
        { field: 'programFamilyName', header: 'Program Family Name' }
      ];
      this.flyoutCatalystFamilyDTO.catalystfamilytotalRecords = this.catalystMainMastersDTO.catalystListfamily.length;
    });

  }
  familyFind(catalystFamily: any) {
    catalystFamily.stauts = 'Y';
    this.catalystMainMastersService.loading = true;
    this.catalystFamilyService.findRole(catalystFamily).subscribe(result => {
      this.commonService.sendToggleFlagFind(true);

      this.catalystMainMastersDTO.catalystListfamily = result.body.data;
      this.notify.showSuccess(result.body.message);
      this.flyoutCatalystFamilyDTO.catalystfamilytotalRecords = this.catalystMainMastersDTO.catalystListfamily.length;
      this.catalystMainMastersService.loading = false;
    }, (error) => {
      this.catalystMainMastersService.loading = false;
      this.notify.showError(error.message);
    });
  }
  catalystFamilychange(data) {
    const familydata = { commercialFamilyName: data };
    this.catalystMainMastersDTO.catalystFamily = familydata;
  }
  getCatalystMain() {
    this.catalystMainMastersService.getCatalystMain((res: any) => {
      this.catalystMainMastersService.loading = false;
      this.catalystMainMastersDTO.catalystmainmaster = res.data;
      this.catalystMainMastersDTO.totalRecords = this.catalystMainMastersDTO.catalystmainmaster.length;
      this.catalystMainMastersDTO.numberOfRecords = this.catalystMainMastersDTO.catalystmainmaster.length;
    });
  }
  catalystFormControls() {
    this.catalystMainMastersDTO.catalystMasterForm = this.formBuilder.group({
      designation: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP),
      Validators.maxLength(255)])),
      catalystFamily: new FormControl('', Validators.compose([Validators.required])),
      type: new FormControl('', Validators.compose([Validators.required])),
      alias: new FormControl('', Validators.compose([Validators.required])),
      shape: new FormControl('', Validators.compose([Validators.required])),
      size: new FormControl('', Validators.compose([Validators.required])),
      state: new FormControl('', Validators.compose([Validators.required])),
      analyticalStatus: new FormControl(''),
      catalystLeader: new FormControl('', Validators.compose([Validators.required])),
      scale: new FormControl('', Validators.compose([Validators.required])),
      technology: new FormControl(''),
      voidFraction: new FormControl(''),
      description: new FormControl('', Validators.maxLength(1000)),
      referenceCatalystIndicator: new FormControl(''),
      regenaratedCatalystIndicator: new FormControl(''),
      bulkLocationIndicator: new FormControl(''),
      analyticalApproveIndicator: new FormControl(''),
      groundIndicator: new FormControl(''),
      limsSampleId: new FormControl('', Validators.compose([Validators.required]))
    });
  }


  save(catalystMainMasters: any) {
    this.catalystMainMastersService.loading = true;
    this.catalystMainMastersDTO.isDisabled = true;
    if (catalystMainMasters.limsSampleId !== undefined && catalystMainMasters.limsSampleId !== null
      && catalystMainMasters.limsSampleId.length !== 0) {
      catalystMainMasters.limsSampleId = catalystMainMasters.limsSampleId.toString();
    } else {
      catalystMainMasters.limsSampleId = '';
    }
    catalystMainMasters.userId = this.catalystMainMastersDTO.leadId;
    this.catalystMainMastersService.save(catalystMainMasters).subscribe(res => {
      this.catalystMainMastersDTO.totalRecords = 0;
      this.catalystMainMastersDTO.isDisabled = false;
      if (res) {
        this.onReset(false);


        this.notify.showSuccess(res.body.message);
      }
    }, (error) => {
      this.catalystMainMastersDTO.isDisabled = false;
      this.catalystMainMastersService.loading = false;
      this.notify.showError(error.message);
    });
  }
  updateMainMaster(catalystMainMasters: any) {
    this.catalystMainMastersService.loading = true;
    this.catalystMainMastersDTO.isDisabled = true;

    catalystMainMasters.userId = this.catalystMainMastersDTO.leadId;
    if (catalystMainMasters.limsSampleId !== undefined && catalystMainMasters.limsSampleId !== null
      && catalystMainMasters.limsSampleId.length !== 0) {
      catalystMainMasters.limsSampleId = catalystMainMasters.limsSampleId.toString();
    }

    this.catalystMainMastersService.update(catalystMainMasters).subscribe(res => {
      this.catalystMainMastersDTO.flag = true;
      this.catalystMainMastersDTO.totalRecords = 0;
      this.catalystMainMastersDTO.isDisabled = false;

      if (res) {
        this.onReset(false);



        this.notify.showSuccess(res.body.message);
      }

    }, (error) => {
      this.catalystMainMastersService.loading = false;
      this.catalystMainMastersDTO.isDisabled = false;

      this.notify.showError(error.message);
    });
  }
  onReset(isReset: boolean) {
    if (isReset) {
      this.catalystMainMastersService.loading = true;

    }
    this.catalystMainMastersDTO.totalRecords = 0;

    this.catalystFamily = new CatalystFamily();
    this.catalystMainMasters = new CatalystMainMasters();
    this.user = new User();

    this.catalystMainMastersDTO.catalystMasterForm.reset();
    this.catalystMainMasters.apparentBedDensityMeasurement = NaN;
    this.catalystMainMasters.vibratedBedDensityMeasurement = NaN;
    this.catalystMainMasters.pieceDensityMeasurement = NaN;
    this.catalystMainMasters.loi500Measurement = NaN;
    this.catalystMainMasters.referenceCatalystIndicator = false;
    this.catalystMainMasters.regenaratedCatalystIndicator = false;
    this.catalystMainMasters.groundIndicator = false;
    this.catalystMainMasters.analyticalApprovalIndicator = false;
    this.catalystMainMasters.bulkLocationIndicator = false;
    this.catalystMainMasters.shapeId = null;
    this.catalystMainMasters.sizeId = null;
    this.catalystMainMastersDTO.uomFlag = false;
    this.catalystMainMastersDTO.flag = true;
    this.catalystMainMastersDTO.catalystShape = null;
    this.catalystMainMastersDTO.catalystSize = null;
    this.getTechnologies();
    this.commonService.sendToggleFlag(true);



    this.catalystMainMastersDTO.limsSampleIdArray = [];
  }
  getLeader() {
    this.catalystMainMastersService.loading = true;

    this.userService.getTechnicalTeamLead().subscribe(res => {
      this.catalystMainMastersDTO.catalystLeader = res.data;
      this.catalystMainMastersService.loading = false;
      this.flyoutCatalystLeaderDTO.leadercols = [
        { field: 'eId', header: 'Leader Eid' },
        { field: 'firstName', header: 'Leader First Name' }
      ];
      this.flyoutCatalystLeaderDTO.catalystLeadertotalRecords = this.catalystMainMastersDTO.catalystLeader.length;
    });
  }

  leaderFind(user: any) {
    this.catalystMainMastersService.loading = true;
    this.userService.find(user).subscribe(result => {
      if (result.body.data === false) {
        this.catalystMainMastersDTO.catalystLeader = [];
      } else {
        this.notify.showSuccess(result.body.message);
        this.commonService.sendToggleFlagFind(true);

        this.catalystMainMastersDTO.catalystLeader = result.body.data;

        this.flyoutCatalystLeaderDTO.catalystLeadertotalRecords =
          this.catalystMainMastersDTO.catalystLeader.length;
        this.catalystMainMastersService.loading = false;
      }
    }, (error) => {
      this.notify.showError(error.message);
      this.catalystMainMastersService.loading = false;
    });
  }

  deleteConfirmation(userdata: any) {
    this.catalystMainMastersDTO.IdToDelete = userdata.id;
    this.catalystMainMastersDTO.skToDelete = userdata.technologyId;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );

    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.catalystMainMastersService.delete(userdata.id, userdata.technologyId).subscribe(res => {
          this.catalystMainMasters = new CatalystMainMasters();
          this.notify.showSuccess(res.body.message);
          this.onReset(true);
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
      this.commonService.configFlag = new BehaviorSubject(false);
    });
  }

  onLeaderEdit(leader: any) {

    this.catalystMainMastersDTO.userName = leader.firstName;
    this.catalystMainMasters.userId = leader.firstName;
    this.catalystMainMastersDTO.leadId = leader.id;
    const flyoutModelClose = document.getElementById('catalystModal');
    flyoutModelClose.click();
  }
  onFamilyEdit(Family: any) {


    this.catalystMainMasters.familyId = Family.id;
    this.catalystMainMastersService.getFamily1(Family.id).subscribe(res => {
      this.catalystMainMasters.typeId = res.data.catalystTypeId;
      this.catalystMainMasters.catalystTypeName = res.data.catalystTypeName;
      if (res.data.commercialFamilyName !== null) {
        this.catalystMainMasters.commercialFamilyName = res.data.commercialFamilyName;
      } else {
        this.catalystMainMasters.commercialFamilyName = res.data.programFamilyName;
      }
    });
    const flyoutModelClose = document.getElementById('familyclose');
    flyoutModelClose.click();
  }

  aliasChange(aliasId) {
    this.catalystMainMastersService.getAlias(aliasId).subscribe(res => {
      this.catalystMainMasters.shapeId = res.data.shapeId;
      this.catalystMainMasters.sizeId = res.data.sizeId;
      this.catalystMainMastersDTO.catalystShape = res.data.shapeName;
      this.catalystMainMastersDTO.catalystSize = res.data.sizeCode;
    });
  }
  scaleChange(aliasId) {
  }
  onEdit(catalystMasterData) {
    let sampleid;
    this.catalystMainMastersDTO.uomFlag = true;
    this.catalystMainMastersDTO.formValid = true;
    this.catalystMainMastersDTO.flag = false;
    this.catalystMainMastersService.loading = true;
    this.catalystMainMastersService.catalystMainById(catalystMasterData.id).subscribe(res => {
      this.catalystMainMasters = res.data;
      this.catalystMainMastersDTO.catalystShape = res.data.catalystShapeName;
      this.catalystMainMastersDTO.catalystSize = res.data.catalystSizeCode;
      this.catalystMainMastersService.loading = false;
      this.catalystMainMastersDTO.leadId = this.catalystMainMasters.userId;
      this.userService.getById(this.catalystMainMastersDTO.leadId).subscribe(user => {
        this.catalystMainMasters.userId = user.data.firstName;
      })
      if (catalystMasterData.commercialFamilyName !== null) {
        this.catalystMainMasters.commercialFamilyName = catalystMasterData.commercialFamilyName;
      }
      if (catalystMasterData.programFamilyName !== null) {

        this.catalystMainMasters.commercialFamilyName = catalystMasterData.programFamilyName;
      }

      if (this.catalystMainMasters.limsSampleId !== null) {
        sampleid = this.catalystMainMasters.limsSampleId;
        this.catalystMainMasters.limsSampleId = sampleid.split(',');
      }

    });
  }

  deleteLimsId(val: any) {
    this.catalystMainMastersDTO.limsSampleIdArray.splice(val, 1);
  }
  find(findcatalyst: any) {
    this.catalystMainMastersService.loading = true;
    this.catalystMainMastersDTO.totalRecords = 0;
    if (this.catalystMainMasters.limsSampleId !== undefined && this.catalystMainMasters.limsSampleId !== null) {
      findcatalyst.limsSampleId = findcatalyst.limsSampleId.toString();
    }
    if (findcatalyst.userId) {
      findcatalyst.userId = this.catalystMainMastersDTO.leadId;
    }
    this.catalystMainMastersService.find(findcatalyst).subscribe(res => {
      if (res.body.data === false) {
        this.catalystMainMastersDTO.catalystmainmaster = [];
      } else {
        this.commonService.sendToggleFlagFind(true);
        this.catalystMainMastersDTO.catalystmainmaster = res.body.data;
        if (findcatalyst.limsSampleId) {
          const limsId = findcatalyst.limsSampleId.split(",");
          this.catalystMainMasters.limsSampleId = [];
          limsId.forEach(val => {
            this.catalystMainMasters.limsSampleId.push(val);
          });
        }
      }

      this.catalystMainMastersDTO.totalRecords = this.catalystMainMastersDTO.catalystmainmaster.length;
      this.catalystMainMastersDTO.catalystmainmasterDetail =
        this.catalystMainMastersDTO.catalystmainmaster.slice(0, this.catalystMainMastersDTO.nOfRecordPage);
      this.notify.showSuccess(res.body.message);
      this.catalystMainMastersService.loading = false;
      this.catalystMainMasters.userId = this.catalystMainMastersDTO.userName;
    }, (error) => {
      this.catalystMainMastersService.loading = false;
      this.catalystMainMastersDTO.totalRecords = 0;
      this.catalystMainMastersDTO.catalystmainmasterDetail = null;
      this.notify.showError(error.message);
    });
  }
  checkboxChange(data: any, no: any) {
    const selectData = data;

    switch (no) {
      case (no === CheckBoxNumber.ONE):
        this.catalystMainMasters.referenceCatalystIndicator = selectData;
        break;
      case (no === CheckBoxNumber.TWO):
        this.catalystMainMasters.regenaratedCatalystIndicator = selectData;
        break;
      case (no === CheckBoxNumber.THREE):
        this.catalystMainMasters.bulkLocationIndicator = selectData;
        break;
      case (no === CheckBoxNumber.FOUR):
        this.catalystMainMasters.analyticalApprovalIndicator = selectData;
        break;
      case (no === CheckBoxNumber.FIVE):
        this.catalystMainMasters.groundIndicator = selectData;
        break;


    }




  }
  catalystMainMasterValue(value: any, type: any) {
    this.catalystMainMastersDTO.uomFlag = true;



    if (type === ValueType.TYPE1) { this.catalystMainMasters.apparentBedDensityMeasurement = value; }
    if (type === ValueType.TYPE2) { this.catalystMainMasters.vibratedBedDensityMeasurement = value; }
    if (type === ValueType.TYPE3) { this.catalystMainMasters.pieceDensityMeasurement = value; }
    if (type === ValueType.TYPE4) { this.catalystMainMasters.loi500Measurement = value; }

    if (isNaN(this.catalystMainMasters.apparentBedDensityMeasurement) ||
      isNaN(this.catalystMainMasters.vibratedBedDensityMeasurement) ||
      isNaN(this.catalystMainMasters.pieceDensityMeasurement) ||
      isNaN(this.catalystMainMasters.loi500Measurement) ||
      this.catalystMainMasters.apparentBedDensityMeasurement === null ||
      this.catalystMainMasters.vibratedBedDensityMeasurement === null ||
      this.catalystMainMasters.pieceDensityMeasurement === null
      || this.catalystMainMasters.loi500Measurement === null) {
      this.catalystMainMastersDTO.formValid = false;
    } else {
      this.catalystMainMastersDTO.formValid = true;
    }
  }

  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.catalystMainMastersDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.catalystMainMastersDTO.uomFlag = false;
        this.dashboardService.showTechnologyHeader = true;
        this.catalystMainMastersService.loading = true;
        this.catalystMainMastersDTO.limsSampleIdArray = [];
        this.catalystMainMastersDTO.flag = true;
        this.catalystMainMastersDTO.nOfRecordPage = 10;
        this.flyoutCatalystFamilyDTO.catalystfamilynOfRecordPage = 10;
        this.flyoutCatalystLeaderDTO.catalystLeadertotalRecords = 10;
        this.flyoutCatalystLeaderDTO.catalystLeadernOfRecordPage = 10;
        this.getTechnologies();
        this.getAllalias();
        this.getStates();
        this.getcatalystScale();
        this.catalystFormControls();
        this.teamLeadFormControls();
        this.catalystFamilyFormControls();

        this.catalystMainMastersDTO.cols = [
          { field: 'designationName', header: 'Designation' },
          { field: 'commercialFamilyName', header: 'Catalyst Family' },

          { field: 'programFamilyName', header: 'Program Family' },

          { field: 'catalystTypeName', header: 'Type' },
          { field: 'catalystShapeName', header: 'Shape' },
          { field: 'catalystSizeCode', header: 'Size' },
          { field: 'catalystStateName', header: 'States' }
        ];

        if (this.catalystMainMastersDTO.privilege) {
          this.catalystMainMastersDTO.cols.push({ field: '', header: 'Action' });
        }
        this.catalystMainMastersService.loading = false;
      }
    })
  }
}
