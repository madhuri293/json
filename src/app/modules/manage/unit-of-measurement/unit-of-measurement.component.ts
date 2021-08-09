import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UnitOfMeasuremnet, UnitOfMeasurementtDTO } from './unit-of-measurement.model';
import { UnitOfMeasurementService } from './unit-of-measurement.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../../../shared/common-services/common.service';
import { StatusEnum, DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unit-of-measurement',
  templateUrl: './unit-of-measurement.component.html',
})
export class UnitOfMeasurementComponent implements OnInit {
  unitOfMeasurement = new UnitOfMeasuremnet();
  unitOfMeasurementtDTO: UnitOfMeasurementtDTO = new UnitOfMeasurementtDTO();

  constructor(private formBuilder: FormBuilder,
    public measurementService: UnitOfMeasurementService,
    private notify: NotificationService,
    private commonService: CommonService,
    private bsModalService: BsModalService,
    private dashboardService: DashboadrdService,
    private router: ActivatedRoute) {
    this.unitOfMeasurementtDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.measurementService.loading = true;

    this.unitOfMeasurementtDTO.nOfRecordPage = 10;
    this.getUomGroupName();
    this.unitOfMeasurementForm();
    this.getUnitOfMeasurement();
  }
  unitOfMeasurementForm() {
    this.unitOfMeasurementtDTO.measurementForm = this.formBuilder.group({
      uomUnitName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(30),
      Validators.pattern(SPACE_REGEXP)])),
      uomGroupName: new FormControl('', Validators.compose([Validators.required])),
      uomUnitDisplayName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100),
      Validators.pattern(SPACE_REGEXP)])),
      baseUnitIndicator: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
      slopeValue: new FormControl('', Validators.compose([Validators.required])),
      interceptValue: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  getUnitOfMeasurement() {
    this.measurementService.loading = true;

    this.measurementService.getAll().subscribe(result => {
      this.unitOfMeasurementtDTO.measurementValues = result.data;
      this.unitOfMeasurementtDTO.measurementValues.forEach(data => {
        data.baseUnitStatus = this.commonService.getBaseUnitStatus(data);

        // tslint:disable-next-line:max-line-length
        this.unitOfMeasurementtDTO.totalRecords = this.unitOfMeasurementtDTO.measurementValues.length;
        this.unitOfMeasurementtDTO.numberOfRecords = this.unitOfMeasurementtDTO.measurementValues.length;
      });
      this.measurementService.loading = false;
    },
      (error) => {
        this.measurementService.loading = false;
      });

    this.unitOfMeasurementtDTO.cols = [
      {
        field: 'unitName', header: 'UOM Unit Name'
      },
      {
        field: 'groupName', subfield: '', header: 'UOM Group Name'
      },
      {
        field: 'unitDisplayName', header: 'UOM Unit Display Name'
      },
      {
        field: 'baseUnitStatus', header: 'Base Unit Indicator '
      },
      {
        field: 'slopeValueCs', header: 'Slope Value'
      },
      {
        field: 'interceptValueCs', header: 'Intercept Value'
      }
    ];
    if (this.unitOfMeasurementtDTO.privilege) {
      this.unitOfMeasurementtDTO.cols.push({
        field: 'Action', header: 'Action'
      }
      );
    }
  }
  formReset() {
    this.getUnitOfMeasurement();
    this.unitOfMeasurement = new UnitOfMeasuremnet();
    this.unitOfMeasurementtDTO.measurementForm.reset();
    this.commonService.sendToggleFlag(true);

  }

  saveUnitOfMeasurement(data: any) {
    data.interceptValueCs = parseFloat(data.interceptValueCs);
    data.slopeValueCs = parseFloat(data.slopeValueCs);
    this.unitOfMeasurementtDTO.isDisable = true;
    if (data.id) {
      delete data.group;
      this.measurementService.update(data).subscribe(result => {
        this.formReset();
        this.notify.showSuccess(result.body.message);
        this.unitOfMeasurementtDTO.isDisable = false;
      },
        (error) => {
          this.unitOfMeasurementtDTO.isDisable = false;
          this.notify.showError(error.message);
        });
    } else {
      this.measurementService.save(data).subscribe(result => {
        this.formReset();
        this.notify.showSuccess(result.body.message);
        this.unitOfMeasurementtDTO.isDisable = false;
      }, error => {
        this.unitOfMeasurementtDTO.isDisable = false;
        this.notify.showError(error.message);
      });
    }
  }

  findUnitOfMeasurement(data: any) {
    if (this.unitOfMeasurementtDTO.measurementForm.dirty || this.unitOfMeasurementtDTO.measurementForm.valid) {
      this.measurementService.loading = true;
      this.measurementService.findUnitOfMeasurement(data).subscribe(result => {
        this.notify.showSuccess(result.body.message);
        this.commonService.sendToggleFlag(true);

        this.unitOfMeasurementtDTO.measurementValues = result.body.data;
        this.unitOfMeasurementtDTO.numberOfRecords = this.unitOfMeasurementtDTO.measurementValues.length;
        // tslint:disable-next-line:no-shadowed-variable
        this.unitOfMeasurementtDTO.measurementValues.forEach((val) => {
          this.unitOfMeasurementtDTO.uomGroupNameList.forEach(uomGroup => {
            if (val.uomGroupId === uomGroup.id) {
              val.uomGroupName = uomGroup.uomGroupName;
            }
          });
          val.baseUnitStatus === StatusEnum.Y ? val.baseUnitStatus = StatusEnum.YES : val.baseUnitStatus = StatusEnum.NO;
        });
        // tslint:disable-next-line:max-line-length
        this.unitOfMeasurementtDTO.measurementDetail = this.unitOfMeasurementtDTO.measurementValues.slice(0, this.unitOfMeasurementtDTO.nOfRecordPage);
        this.unitOfMeasurementtDTO.totalRecords = this.unitOfMeasurementtDTO.measurementValues.length;
        this.measurementService.loading = false;
      }, (error) => {
        this.notify.showError(error.message);
        this.unitOfMeasurementtDTO.measurementDetail = 0;
        this.unitOfMeasurementtDTO.totalRecords = 0;
        this.measurementService.loading = false;
      });
    } else {
      this.notify.showError('Please enter at least one field to search');
    }

  }

  getUomGroupName() {
    this.measurementService.getUomGroupList().subscribe(result => {
      this.unitOfMeasurementtDTO.uomGroupNameList = result.data;
    });
  }

  deleteConfirmation(measurementData: any) {
    this.unitOfMeasurementtDTO.measurementId = measurementData.id;
    this.unitOfMeasurement.sk = measurementData.groupId;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.measurementService.delete(this.unitOfMeasurementtDTO.measurementId, this.unitOfMeasurement.sk).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.formReset();
        }, (error) => {
          this.notify.showError(error.message);
        });
        this.measurementService.configFlag = new BehaviorSubject(false);
      }
    });
  }

  onRoleEditClick(data: any) {
    this.unitOfMeasurementtDTO.isDisable = false;
    this.measurementService.getById(data.id).subscribe(
      result => {
        this.unitOfMeasurement = result.data;
      }, error => {
        this.notify.showError(error.message);
      });
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
