import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Caliberation, CaliberationDTO } from './caliberation.model';
import { FormControl, Validators, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { CalibrationService } from './calibration.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { MEASUREMENT_REGEX, CALIBRATIONRANGE_REGEX } from '../../../core/validators.ts/validators';
import { BehaviorSubject } from 'rxjs';
import { EquipmentService } from '../equipment/equipment.service';
import { PlantService } from '../plant/plant.service';
import { CommonService } from '../../../shared/common-services/common.service';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-caliberation',
  templateUrl: './caliberation.component.html'
})
export class CaliberationComponent implements OnInit {
  caliberation = new Caliberation();
  caliberationDTO: CaliberationDTO = new CaliberationDTO();

  constructor(private formBuilder: FormBuilder,
    public caliberationService: CalibrationService,
    private notify: NotificationService,
    private calibrationService: CalibrationService,
    private activatedRoute: ActivatedRoute,
    private equipmentService: EquipmentService,
    private plantService: PlantService,
    private commonService: CommonService,
    private bsModalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboadrdService
  ) {
    this.caliberationDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.caliberationService.loading = true;
    this.caliberationDTO.isEnable = false;
    this.caliberationDTO.formValid = false;
    this.caliberationDTO.controlFlag = true;
    this.caliberationDTO.nOfRecordPage = 10;

    this.caliberationDTO.paramSubscription = this.activatedRoute.params.subscribe(params => {
      this.caliberationDTO.equipmentId = params.id;
      this.equipmentService.getById(this.caliberationDTO.equipmentId).subscribe(data => {
        this.caliberationDTO.equipment = data.data;
        this.caliberation.equipmentName = this.caliberationDTO.equipment.equipmentName;
        if (this.caliberationDTO.equipment.plantId !== '') {
          this.plantService.getById(this.caliberationDTO.equipment.plantId).subscribe(result => {
            this.caliberationDTO.plant = result.data;
            this.caliberation.plantCode = this.caliberationDTO.plant.code;
            this.getCaliberationList();
          });
        }
      });
    });

    this.activatedRoute.data.subscribe((response) => {
      this.caliberationDTO.caliberationFactorList = response.cfactor.data;

      this.caliberationDTO.caliberationFactorList.forEach((item: any) => {
        this.caliberationDTO.caliberationFactorMap.set(item.id, item.name);
      });
    });

    
    this.caliberationDTO.columns = [
      { field: 'plantCode', header: 'Plant Code' },
      { field: 'equipmentName', header: 'Equipment Name' },
      { field: 'fitR2Measurement', header: 'Fit R²' },
      { field: 'slopeValueMeasurement', header: 'Slope (m)' },
      { field: 'interceptValueMeasurement', header: 'Intercept (b)' },
      { field: 'minValueMeasurement', header: 'Min Calibration Range (sccm)' },
      { field: 'maxValueMeasurement', header: 'Max Calibration Range (sccm)' },
      { field: 'calibrationDateTime', header: 'Calibration Date' },
      {
        field: 'calibrationTypeName', header: 'Calibration Factor '
      },
      {
        field: 'controlMinRange', header: 'Control Min Range'
      },
      {
        field: 'controlMaxRange', header: 'Control Max Range'
      },
      {
        field: 'Action', header: 'Action'
      }
    ];
  
    


    this.caliberationDTO.caliberationForm = this.formBuilder.group({
      plantCode: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
      equipmentName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
      fitR2Measurement: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20),
      Validators.pattern(MEASUREMENT_REGEX)])),
      slopeValueMeasurement: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
      interceptValueMeasurement: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
      maxValueMeasurement: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20),
      Validators.pattern(MEASUREMENT_REGEX)])),
      minValueMeasurement: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20),
      Validators.pattern(MEASUREMENT_REGEX)])),
      calibrationDateTime: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
      calibrationFactorId: new FormControl('', Validators.compose([Validators.required])),
      controlMinRange: new FormControl('', Validators.compose([Validators.maxLength(20),
      Validators.pattern(CALIBRATIONRANGE_REGEX)])),
      controlMaxRange: new FormControl('', Validators.compose([Validators.maxLength(20),
      Validators.pattern(CALIBRATIONRANGE_REGEX)])),
    }

    );
    this.caliberationDTO.min = null;
    this.caliberationDTO.max = null;
    this.caliberationDTO.minerrormsg = '';

    this.caliberationDTO.controlMin = null;
    this.caliberationDTO.controlMax = null;
    this.caliberationDTO.controlMinErrorMsg = '';
  }



  calibrationSave(calibration: any) {
    this.caliberationDTO.isEnable = false;
    this.caliberationDTO.isDisabled = true;
    if (calibration.id) {

      calibration.plantId = this.caliberationDTO.caliberationUpdate.plantId;
      calibration.equipmentId = this.caliberationDTO.caliberationUpdate.equipmentId;
      calibration.id = this.caliberationDTO.caliberationUpdate.id;

      this.caliberationService.update(calibration).subscribe(result => {
        this.notify.showSuccess(result.body.message);
        this.onResetClick();
        this.caliberationDTO.isDisabled = false;
      },
        (error) => {
          this.caliberationDTO.isDisabled = false;
          this.notify.showError(error.message);
        });

    } else {
      calibration.plantId = this.caliberationDTO.equipment.plantId;
      calibration.equipmentId = this.caliberationDTO.equipment.id;
      this.caliberationService.save(calibration).subscribe(result => {
        this.notify.showSuccess(result.body.message);
        this.onResetClick();
        this.caliberationDTO.isDisabled = false;
      }, (error) => {
        this.caliberationDTO.isDisabled = false;
        this.notify.showError(error.message);
      });
    }
  }

  minNMaxValue(min: any, max: any) {

    this.caliberationDTO.minErrorMsg = null;
    this.caliberationDTO.maxErrorMsg = null;
    if (Number(min) > Number(max) && min !== undefined && max !== undefined) {
      this.caliberationDTO.minErrorMsg = 'Control Min must be less than Control Max';
      this.caliberationDTO.maxErrorMsg = 'Control Max must be greater than Control Min';
    } else {
      this.caliberationDTO.minErrorMsg = null;
      this.caliberationDTO.maxErrorMsg = null;
    }

  }
  upperRangeAndLowerRange(maxValueMeasurement: string, minValueMeasurement: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: boolean } => {
      const lowerRanges = group.controls[maxValueMeasurement];
      const upperRanges = group.controls[minValueMeasurement];

      if ((group.controls[maxValueMeasurement].enabled && group.controls[minValueMeasurement].enabled) ||
        (group.controls[maxValueMeasurement].dirty && group.controls[minValueMeasurement].dirty)) {
        if (Number(upperRanges.value) <= Number(lowerRanges.value)) {
          return null;
        } else {
          lowerRanges.setErrors({ rangeError: true });
        }
      }
    };
  }

  onResetClick() {
    this.caliberationDTO.isEnable = false;
    this.caliberationDTO.controlFlag = true;
    this.caliberation = new Caliberation();
    this.caliberation.plantCode = this.caliberationDTO.plant.code;
    this.caliberation.equipmentName = this.caliberationDTO.equipment.equipmentName;
    this.caliberationDTO.min = null;
    this.caliberationDTO.max = null;
    this.caliberationDTO.minerrormsg = '';

    this.caliberationDTO.controlMin = null;
    this.caliberationDTO.controlMax = null;
    this.caliberationDTO.controlMinErrorMsg = '';
    this.formReset();
    this.getCaliberationList();
    this.commonService.sendToggleFlag(true);

  }

  getCaliberationList() {
    this.caliberationService.loading = true;
    this.caliberationService.getAllCaliberationData(this.caliberationDTO.plant.id,
      this.caliberationDTO.equipmentId).subscribe(result => {
      this.caliberationDTO.caliberationList = result.data;
      this.caliberationDTO.totalRecords = this.caliberationDTO.caliberationList.length;
      this.caliberationService.loading = false;
    },
      (error) => {
        this.caliberationDTO.totalRecords = 0;
        this.caliberationService.loading = false;
      });
  }

  deleteConfirmation(caliberation: any) {
    this.caliberationDTO.calibrationId = caliberation.id;
    this.caliberationDTO.skId = caliberation.equipmentId;

    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {

      if (result) {
        this.caliberationService.delete(this.caliberationDTO.calibrationId, this.caliberationDTO.skId).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.formReset();
          this.getCaliberationList();
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
      this.commonService.configFlag = new BehaviorSubject(false);
    });

  }

  oncaliberationDelete(data: string, sk: any) {
    this.caliberationService.delete(data, sk).subscribe(result => {
      this.onResetClick();
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }



  find(caliberation: any) {
    caliberation.equipmentId  = this.caliberationDTO.equipmentId;
     caliberation.plantId = this.caliberationDTO.equipment.plantId;
    if (this.caliberationDTO.caliberationForm.dirty || this.caliberationDTO.caliberationForm.valid) {
      this.caliberationService.loading = true;
      this.caliberationService.find(caliberation).subscribe(result => {
        this.notify.showSuccess(result.body.message);
        this.caliberationDTO.caliberationList = result.body.data;
        this.commonService.sendToggleFlag(true);

        this.caliberationDTO.totalRecords = this.caliberationDTO.caliberationList.length;
        this.caliberationService.loading = false;

      }, (error) => {

        this.notify.showError(error.message);
        this.caliberationDTO.caliberationList = 0;
        this.caliberationDTO.totalRecords = 0;
        this.caliberationService.loading = false;
      });
    } else {
      this.notify.showError('Please enter at least one field to search');

    }

  }

  onRoleEditClick(evt: any) {
    this.caliberationDTO.isDisabled = false;
    this.caliberationDTO.isEnable = true;
    this.caliberationDTO.formValid = true;
    this.caliberationDTO.controlFlag = true;
    this.caliberationDTO.caliberationUpdate = evt;
    this.caliberationService.getById(evt.id).subscribe(
      role => {
        this.caliberationDTO.min = role.data.minValueMeasurement;
        this.caliberationDTO.max = role.data.maxValueMeasurement;
        this.caliberationDTO.controlMin = role.data.controlMinRange;
        this.caliberationDTO.controlMax = role.data.controlMaxRange;
        this.caliberation = role.data;
      },
      (error) => {
        this.notify.showError(error.message);
      });
  }


  formReset() {
    this.caliberationDTO.caliberationForm.controls.fitR2Measurement.reset();
    this.caliberationDTO.caliberationForm.controls.slopeValueMeasurement.reset();
    this.caliberationDTO.caliberationForm.controls.interceptValueMeasurement.reset();
    this.caliberationDTO.caliberationForm.controls.maxValueMeasurement.reset();
    this.caliberationDTO.caliberationForm.controls.minValueMeasurement.reset();
    this.caliberationDTO.caliberationForm.controls.calibrationDateTime.reset();
    this.caliberationDTO.caliberationForm.controls.calibrationFactorId.reset();
    this.caliberationDTO.caliberationForm.controls.controlMinRange.reset();
    this.caliberationDTO.caliberationForm.controls.controlMaxRange.reset();
  }

  onBackClick() {
    this.router.navigate(['/manage/equipment']);
  }

  checkmin(minvalue: any) {
    this.caliberationDTO.min = minvalue;
    // tslint:disable-next-line:radix
    if (this.caliberationDTO.max !== '' && parseInt(this.caliberationDTO.min) > parseInt(this.caliberationDTO.max)) {
      this.caliberationDTO.minerrormsg = 'Min Calibration Range cannot be greater than Max Calibration Range';
      this.caliberationDTO.formValid = false;
    } else {
      this.caliberationDTO.minerrormsg = '';
      this.caliberationDTO.formValid = true;
    }
  }

  checkmax(maxvalue: any) {
    this.caliberationDTO.max = maxvalue;
    // tslint:disable-next-line:radix
    if (this.caliberationDTO.min !== '' && parseInt(this.caliberationDTO.min) > parseInt(this.caliberationDTO.max)) {
      this.caliberationDTO.minerrormsg = 'Min Calibration Range cannot be greater than Max Calibration Range';
      this.caliberationDTO.formValid = false;
    } else {
      this.caliberationDTO.minerrormsg = '';
      this.caliberationDTO.formValid = true;
    }
  }

  checkControlMin(controlMinValue: any) {
    this.caliberationDTO.controlMin = controlMinValue;
    // tslint:disable-next-line:radix
    if (this.caliberationDTO.controlMax !== '' && parseInt(this.caliberationDTO.controlMin) > parseInt(this.caliberationDTO.controlMax)) {
      this.caliberationDTO.controlMinErrorMsg = 'Min Control Range cannot be greater than Max Control Range';
      this.caliberationDTO.controlFlag = false;
    } else {
      this.caliberationDTO.controlMinErrorMsg = '';
      this.caliberationDTO.controlFlag = true;
    }
  }

  checkControlMax(controlMaxValue: any) {
    this.caliberationDTO.controlMax = controlMaxValue;
    // tslint:disable-next-line:radix
    if (this.caliberationDTO.controlMin !== '' && parseInt(this.caliberationDTO.controlMin) > parseInt(this.caliberationDTO.controlMax)) {
      this.caliberationDTO.controlMinErrorMsg = 'Min Control Range cannot be greater than Max Control Range';
      this.caliberationDTO.controlFlag = false;
    } else {
      this.caliberationDTO.controlMinErrorMsg = '';
      this.caliberationDTO.controlFlag = true;
    }
  }

}
