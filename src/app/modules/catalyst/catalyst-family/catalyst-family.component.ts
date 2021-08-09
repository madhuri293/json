import { Component, OnInit } from '@angular/core';
import { CatalystFamily, CatalystFamilyDTO } from './catalyst-family.model';
import { CatalystFamilyService } from './catalyst-family.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { CatalystTypeService } from '../catalyst-type/catalyst-type.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { CatalystFamilyEnum, StatusEnum, DeleteMessageEnum, ValueType } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { CatalystApplicationService } from '../catalyst-application/catalyst-application.service';

@Component({
  selector: 'app-catalyst-family',
  templateUrl: './catalyst-family.component.html'
})
export class CatalystFamilyComponent implements OnInit {
  catalystFamily: CatalystFamily = new CatalystFamily();
  catalystFamilyDTO: CatalystFamilyDTO = new CatalystFamilyDTO();


  constructor(private catalystFamilyService: CatalystFamilyService, private commonService: CommonService,
    private formBuilder: FormBuilder, private notify: NotificationService, private catalystTypeService: CatalystTypeService,
    private bsModalService: BsModalService, private router: ActivatedRoute, private dashboardService: DashboadrdService,
    public catalystApplicationService: CatalystApplicationService) {
    this.catalystFamilyDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.catalystFamilyDTO.loading = true;
    this.dashboardService.showTechnologyHeader = false;
    this.catalystFamilyDTO.radioFlag = false;
    this.catalystFamilyDTO.formValid = false;
    this.initialformControl();
    this.getcatalystTypeList();
    this.catalystFamilyDTO.nOfRecordPage = 10;
    this.catalystFamily.commercialFamilyName = null;
    this.catalystFamily.programFamilyName = null;

    this.catalystFamilyDTO.columns = [

      { field: 'commercialFamilyName', header: ' Commercial Name' },
      { field: 'programFamilyName', header: 'Program Name' },
      { field: 'catalystTypeName', header: 'Family Type' },
      { field: 'catalystApplicationName', header: 'Catalyst Application' },
      { field: 'familyInd', header: 'Family Name Indicator' },
      { field: 'sdsNum', header: 'SDS#' },
      { field: 'status', header: 'Status' }

    ];
    if (this.catalystFamilyDTO.privilege) {
      this.catalystFamilyDTO.columns.push({ field: 'delete', header: 'Action' });
    }
    this.getStatus();
  }
  units(data) {

    if (data.length > 0) {
      this.getcatalystFamilyList();

    }
  }
  getStatus() {
    this.catalystFamilyDTO.statusList = this.commonService.getStatusList();
  }
  commercialFamilyRadio(event: any) {
    if (event.target.value === CatalystFamilyEnum.RADIO1) {
      this.catalystFamilyDTO.uomFlag = true;
      this.catalystFamilyDTO.isRadio1 = true;
      this.catalystFamilyDTO.isRadio2 = false;
      this.catalystFamilyDTO.isCommercial = false;
      this.catalystFamilyDTO.isProgram = true;
      this.catalystFamilyDTO.catalystFamilyForm.controls.commercialFamilyName.setValidators([Validators.pattern(SPACE_REGEXP),
      Validators.maxLength(255)]);

      this.catalystFamily.familyInd = CatalystFamilyEnum.COMMERCIALNAME;
      this.catalystFamilyDTO.radioFlag = true;
    }
  }
  programFamilyRadio(event: any) {
    if (event.target.value === CatalystFamilyEnum.RADIO2) {
      this.catalystFamilyDTO.uomFlag = true;
      this.catalystFamilyDTO.isRadio2 = true;
      this.catalystFamilyDTO.isRadio1 = false;
      this.catalystFamilyDTO.isCommercial = true;
      this.catalystFamilyDTO.isProgram = false;
      this.catalystFamilyDTO.catalystFamilyForm.controls.programFamilyName.setValidators([Validators.pattern(SPACE_REGEXP),
      Validators.maxLength(255)]);

      this.catalystFamily.familyInd = CatalystFamilyEnum.PROGRAMNAME;
      this.catalystFamilyDTO.radioFlag = true;
    }
  }

  
  catalystFamilyFromControls() {

    this.catalystFamilyDTO.catalystFamilyForm = this.formBuilder.group(
      {

        commercialFamilyName: new FormControl('', Validators.compose([Validators.pattern(SPACE_REGEXP), Validators.maxLength(255)])),
        programFamilyName: new FormControl('', Validators.compose([Validators.pattern(SPACE_REGEXP), Validators.maxLength(255)]))
      }

    );
  }

  initialformControl() {
    this.catalystFamilyDTO.catalystFamilyForm = this.formBuilder.group(
      {
        catalystTypeId: new FormControl('', Validators.compose([Validators.required])),
        sdsNum: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP), Validators.maxLength(255)])),
        status: new FormControl('', Validators.compose([Validators.required])),
        // tslint:disable-next-line:max-line-length
        commercialFamilyName: new FormControl('', Validators.compose([Validators.pattern(SPACE_REGEXP), Validators.maxLength(255)])),
        programFamilyName: new FormControl('', Validators.compose([Validators.pattern(SPACE_REGEXP), Validators.maxLength(255)])),
        catalystApplicationId: new FormControl('', Validators.compose([Validators.required])),


      }
    );
  }

  getcatalystTypeList() {
    this.catalystTypeService.getAllActiveCatalystType().subscribe(result => {
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);


      });

      this.catalystFamilyDTO.catalystTypeList = result.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }


  getCatalystApplication(id: any) {
    
    this.catalystTypeService.getApplicationDetails(id).subscribe(result => {
      const applicationData = result.data;

      this.catalystFamilyDTO.applicationDetailsList = applicationData.filter(data => data.status === 'Y');
      this.catalystFamilyDTO.isEdit= this.catalystFamilyDTO.applicationDetailsList
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }




  saveCatalystFamilyData(catalystFamily: any) {
    this.catalystFamilyDTO.isDisabled = true;
    this.catalystFamilyDTO.loading = true;

    if (catalystFamily.id) {
      catalystFamily.status = this.commonService.getStatusToFind(catalystFamily);

      this.catalystFamilyService.update(catalystFamily).subscribe(result => {
        this.catalystFamilyDTO.formValid = false;
        this.catalystFamilyDTO.totalRecords = 0;
        this.catalystFamilyDTO.isDisabled = false;
        this.catalystFamilyDTO.isSave = true;

        this.onResetClick(this.catalystFamilyDTO.loading);


        this.notify.showSuccess(result.body.message);

        this.catalystFamilyDTO.isCommercial = false;
        this.catalystFamilyDTO.isProgram = false;


      },
        (error) => {

          this.catalystFamilyDTO.isDisabled = false;

          this.notify.showError(error.message);
          catalystFamily.status = this.commonService.getStatus(catalystFamily);

        });
    } else {

      catalystFamily.status = this.commonService.getStatusToFind(catalystFamily);
      this.catalystFamilyService.save(catalystFamily).subscribe(result => {
        this.catalystFamilyDTO.formValid = false;
        this.catalystFamilyDTO.isDisabled = false;

        this.catalystFamilyDTO.totalRecords = 0;
        this.onResetClick(this.catalystFamilyDTO.loading);

        this.catalystFamilyDTO.isCommercial = false;
        this.catalystFamilyDTO.isProgram = false;
        this.notify.showSuccess(result.body.message);

      }, (error) => {

        this.catalystFamilyDTO.isDisabled = false;

        this.notify.showError(error.message);
        catalystFamily.status = this.commonService.getStatus(catalystFamily);


      });
    }

  }
  getcatalystFamilyList() {

    this.catalystFamilyService.getAllCatalystFamily().subscribe(result => {
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);

      });
      this.catalystFamilyDTO.rows = result.data;
      this.catalystFamilyDTO.totalRecords = this.catalystFamilyDTO.rows.length;
      this.catalystFamilyDTO.loading = false;

    },
      (error) => {
        this.catalystFamilyDTO.loading = false;
        this.notify.showError(error.message);
      });
  }

  onResetClick(isloading:boolean) {
    if(!isloading){
      this.catalystFamilyDTO.loading = true;
    } 
    this.catalystFamilyDTO.totalRecords = 0;

    this.catalystFamily = new CatalystFamily();
    this.catalystFamilyDTO.catalystFamilyForm.reset();
    this.catalystFamilyDTO.isRadio2 = false;

    this.catalystFamilyDTO.isRadio1 = false;
    this.catalystFamily.pieceDensityArMax = NaN;
    this.catalystFamily.pieceDensityArMin = NaN;
    this.catalystFamily.loiMin = NaN;
    this.catalystFamily.loiMax = NaN;
    this.catalystFamily.sulfurMin = NaN;
    this.catalystFamily.sulfurMax = NaN;
    this.catalystFamilyDTO.uomFlag = false;
    this.catalystFamilyDTO.applicationDetailsList = [];
    this.catalystFamilyDTO.radioFlag = false;
    this.commonService.sendToggleFlag(true);

  }
  onRoleEditClick(evt: any) {
    this.catalystFamilyDTO.isEdit = false;
    this.catalystFamilyDTO.uomFlag = true;
    this.catalystFamilyDTO.radioFlag = true;
    if (evt.catalystFamilyInd === CatalystFamilyEnum.PROGRAMNAME) {
      this.catalystFamilyDTO.catalystFamilyForm.controls.commercialFamilyName.clearValidators();

    } else {
      this.catalystFamilyDTO.catalystFamilyForm.controls.programFamilyName.clearValidators();
    }

    if (evt.pieceDensityArMaxMsr === null || evt.pieceDensityArMinMsr === null || evt.loiMaxMsr === null
      || evt.loiMinMsr === null || evt.sulfurMaxMsr === null || evt.sulfurMinMsr === null) {

      this.catalystFamilyDTO.uomFlag = false;

    } else {
      this.catalystFamilyDTO.uomFlag = true;

    }
    if (evt.familyInd === CatalystFamilyEnum.COMMERCIALNAME) {
      this.catalystFamilyDTO.isRadio1 = true;
      this.catalystFamilyDTO.isRadio2 = false;
      this.catalystFamilyDTO.isProgram = true;
      this.catalystFamilyDTO.isCommercial = false;
    } else if (evt.familyInd === CatalystFamilyEnum.PROGRAMNAME) {
      this.catalystFamilyDTO.isRadio2 = true;
      this.catalystFamilyDTO.isRadio1 = false;

      this.catalystFamilyDTO.isCommercial = true;
      this.catalystFamilyDTO.isProgram = false;

    }
    this.catalystFamilyService.getById(evt.id).subscribe(role => {
      this.catalystFamily = role.data;
      this.catalystFamilyDTO.formValid = true;
      role.data.status = this.commonService.getStatus(role.data);


      this.catalystTypeService.getAllCatalystType().subscribe(result => {
        result.data.forEach(data => {
          if (data.id === this.catalystFamily.catalystTypeId && data.status === StatusEnum.N) {
            this.catalystFamilyDTO.catalystTypeList.push(data);
          }
        });
      },(error)=>{
       
          this.notify.showError(error.message);
      });
      this.catalystApplicationService.getAllCatalystApplication().subscribe(result => {
        result.data.forEach(data => {
          if (data.id === this.catalystFamily.catalystApplicationId) {
            this.catalystFamilyDTO.applicationDetailsList = [data];

          }
        });
      },(error)=>{
        this.notify.showError(error.message);
      });
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  onCatalystTypeDelete(id: any, sk: any) {
    this.catalystFamilyService.delete(id, sk).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.catalystFamily = new CatalystFamily();
      this.catalystFamilyDTO.catalystFamilyForm.reset();

      this.onResetClick(false);
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  find(catalystFamily: any) {
    this.catalystFamilyDTO.totalRecords = 0;
    if (catalystFamily.status) {
      catalystFamily.status = this.commonService.getStatusToFind(catalystFamily);

    }

    this.catalystFamilyDTO.rows = [];
    this.catalystFamilyDTO.loading = true;
    this.catalystFamilyService.findRole(catalystFamily).subscribe(result => {
      this.catalystFamilyDTO.rows = result.body.data;
      this.commonService.sendToggleFlagFind(true);

      this.catalystFamilyDTO.rows.forEach(data => {
        data.status = this.commonService.getStatus(data);



      });
      if (catalystFamily.status) {
        catalystFamily.status = this.commonService.getStatus(catalystFamily);

      }
      this.catalystFamily = catalystFamily;
      this.catalystFamilyDTO.catalystFamilyList = this.catalystFamilyDTO.rows;
      this.catalystFamilyDTO.numberOfRecords = this.catalystFamilyDTO.catalystFamilyList.length;
      this.catalystFamilyDTO.totalRecords = this.catalystFamilyDTO.catalystFamilyList.length;
      this.notify.showSuccess(result.body.message);
      this.catalystFamilyDTO.loading = false;
    },
      (error) => {
        this.catalystFamilyDTO.loading = false;
        this.catalystFamilyDTO.catalystFamilyList = null;
        this.catalystFamilyDTO.totalRecords = 0;
        this.notify.showError(error.message);
        if (catalystFamily.status) {
          catalystFamily.status = this.commonService.getStatus(catalystFamily);
        }
      });

  }
  deleteConfirmation(catalystFamily: any) {
    this.catalystFamilyDTO.idToDelete = catalystFamily.id;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) { this.onCatalystTypeDelete(this.catalystFamilyDTO.idToDelete, this.catalystFamilyDTO.idToDelete); }
    });
  }


  catalystFamilyValue(value: any, type: any) {
    this.catalystFamilyDTO.uomFlag = true;
    if (type === ValueType.TYPE2) {
      this.catalystFamily.pieceDensityArMax = value;
    } else if (type === ValueType.TYPE1) {
      this.catalystFamily.pieceDensityArMin = value;

    } else if (type === ValueType.TYPE3) {
      this.catalystFamily.loiMin = value;

    } else if (type === ValueType.TYPE4) {
      this.catalystFamily.loiMax = value;

    } else if (type === ValueType.TYPE5) {
      this.catalystFamily.sulfurMin = value;

    } else if (type === ValueType.TYPE6) {
      this.catalystFamily.sulfurMax = value;

    }


    if (isNaN(this.catalystFamily.pieceDensityArMax) ||
      isNaN(this.catalystFamily.pieceDensityArMin) ||
      isNaN(this.catalystFamily.loiMin) ||
      isNaN(this.catalystFamily.loiMax) ||
      isNaN(this.catalystFamily.sulfurMin) ||
      isNaN(this.catalystFamily.sulfurMax) ||
      this.catalystFamily.pieceDensityArMax === null ||
      this.catalystFamily.pieceDensityArMin === null ||
      this.catalystFamily.loiMin === null ||
      this.catalystFamily.loiMax === null ||
      this.catalystFamily.sulfurMin === null ||
      this.catalystFamily.sulfurMax === null) {
      this.catalystFamilyDTO.formValid = false;
    } else {
      this.catalystFamilyDTO.formValid = true;
    }


  }
}
