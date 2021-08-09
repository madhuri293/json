import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, Validators} from '@angular/forms';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { ModeService } from './mode.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { BehaviorSubject } from 'rxjs';
import { Mode, ModeDTO } from './mode.model';
import { CommonService } from '../../../shared/common-services/common.service';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { ActivatedRoute } from '@angular/router';
import { ModeDescription, ModeSystemRecords, StatusEnum } from '../../../shared/enum/enum.model';


@Component({
  selector: 'app-mode',
  templateUrl: './mode.component.html'
})

export class ModeComponent implements OnInit {
  mode: Mode = new Mode();
  modeDTO: ModeDTO = new ModeDTO();



  constructor(private commonService: CommonService, private dashboardService: DashboadrdService
    , private formBuilder: FormBuilder, private router: ActivatedRoute,
    public modeService: ModeService, private notify: NotificationService) {
    this.modeDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.modeService.loading = true;

    this.dashboardService.showTechnologyHeader = true;
    this.modeDTO.uomFlag = false;
    this.modeDTO.uomDirty = false;
    this.getTechnologies();
    this.getmode();
    this.getControl();
    this.getSulfiding();
    this.modeFormControls();
    this.modeDTO.nOfRecordPage = 10;
    this.modeDTO.columns = [
      { field: 'modeNumber', header: 'Mode#' },
      { field: 'modeDescription', header: 'Description' },
      { field: 'objectiveName', header: 'Mode' },
      { field: 'controlName', header: 'Control' },
      { field: 'sulfindingName', header: 'Sulfiding' },
      { field: 'condition', header: 'Conditions' }
    ];
    if (this.modeDTO.privilege) {
      this.modeDTO.columns.push({ field: 'action', header: 'Action' });
    }
    this.modeDTO.modeForm.reset();
    this.refresh();
  }
  units(data: any) {
    if (data.length > 0) {
      this.getModeGridList();

    }
  }
  getTechnologies() {
    const selectedTechnology = localStorage.getItem('technology');
    this.mode.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.modeDTO.technology = result.data;
      this.modeDTO.technology = this.modeDTO.technology.filter(val => val.status === StatusEnum.Y);
      this.modeDTO.technology = this.modeDTO.technology.filter(tech => tech.technologyId === selectedTechnology);

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  getmode() {
    this.modeService.getProductObjective().subscribe(result => {
      this.modeDTO.modeDataList = result.data;

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  getControl() {
    this.modeService.getControlMethod().subscribe(result => {
      this.modeDTO.controlDataList = result.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  getSulfiding() {
    this.modeService.getSulfinding().subscribe(result => {
      this.modeDTO.sulfidingDataList = result.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  modeFormControls() {
    this.modeDTO.modeForm = this.formBuilder.group(
      {
        modeNumber: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP),
        Validators.maxLength(255)])),
        modeObjectiveId: new FormControl('', Validators.compose([Validators.required])),
        technology: new FormControl(''),
        control: new FormControl('', Validators.compose([Validators.required])),
        sulfiding: new FormControl('', Validators.compose([Validators.required])),
        pressure: new FormControl(''),
        lhsv: new FormControl(''),
        scfb: new FormControl(''),
        condition: new FormControl('',  Validators.compose(
          [Validators.required, Validators.pattern(SPACE_REGEXP),
            Validators.min(1), Validators.max(10)])),
        modeDescription: new FormControl('', Validators.compose([Validators.required,
        Validators.maxLength(500), Validators.pattern(SPACE_REGEXP)]))

      }
    );

  }

  getModeGridList() {
    // this.modeDTO.totalRecords = 0;
    this.mode.modeDescription = '';
    // this.modeService.loading = true;

    this.modeService.getAllMode().subscribe(result => {
      this.modeService.loading = false;
      this.modeDTO.modeGridDataList = result.data;
      this.modeDTO.totalRecords = this.modeDTO.modeGridDataList.length;
    },
      (error) => {
        this.modeService.loading = false;
        this.notify.showError(error.message);

      });
  }
  reset() {
    this.modeService.loading = true;

    this.modeDTO.uomDirty = false;
    this.modeDTO.modeForm.reset();
    this.mode.modeDescription = null;
    this.mode = new Mode();
    this.modeDTO.ModeValue = null;
    this.modeDTO.controlValue = null;
    this.modeDTO.sulfidingValue = null;
    this.modeDTO.pressureVal = null;
    this.modeDTO.ddPressure = null;
    this.modeDTO.controlVal = null;
    this.modeDTO.ddControl = null;
    this.modeDTO.sulfidingVal = null;
    this.modeDTO.ddsulfiding = null;
    this.modeDTO.uomFlag = false;
    this.modeDTO.formValid = false;
    this.mode.pressure = '';
    this.mode.lhsv = '';
    this.mode.scfb = '';
    this.getTechnologies();
    this.getmode();
    this.getControl();
    this.getSulfiding();
    this.commonService.sendToggleFlag(true);



  }
  onEditClick(evt: any) {
    this.modeDTO.formValid = true;

    this.modeService.getById(evt.id).subscribe(result => {
      this.updateDescUOMChange(result.data.objectiveId, ModeDescription.MODETYPE, result.data);
      this.updateDescUOMChange(result.data.controlMethodId, ModeDescription.CONTROLTYPE, result.data);
      this.updateDescUOMChange(result.data.sulfindingId, ModeDescription.SULFIDINGTYPE, result.data);
      this.mode = result.data;

      this.modeService.loading = false;
      this.modeDTO.formValid = true;
      this.modeDTO.uomFlag = true;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  find(data: any) {


    this.modeDTO.rows = [];

    this.modeService.loading = true;
    this.modeService.find(data).subscribe(result => {
      this.modeDTO.modeGridDataList = result.body.data;
      this.commonService.sendToggleFlagFind(true);

      this.modeDTO.modeGridDataList = result.body.data;
      this.modeDTO.totalRecords = this.modeDTO.modeGridDataList.length;
      this.notify.showSuccess(result.body.message);
      this.modeService.loading = false;
    },
      (error) => {
        this.modeDTO.modeGridDataList = [];
        this.modeDTO.totalRecords = 0;
        this.notify.showError(error.message);
        this.modeService.loading = false;
      });
  }
  save(mode: any) {

    if (mode.id) {
      this.modeService.loading = true;
      this.modeService.update(mode).subscribe(result => {

        this.notify.showSuccess(result.body.message);
        this.modeService.loading = false;
        this.reset();
      },
        (error) => {

          this.notify.showError(error.message);
          this.modeService.loading = false;
        });

    } else {
      this.modeService.loading = true;
      this.modeService.save(mode).subscribe(result => {

        this.notify.showSuccess(result.body.message);
        this.modeService.loading = false;
        this.reset();

      }, (error) => {

        this.notify.showError(error.message);
        this.modeService.loading = false;
      });
    }
  }
  deleteConfirmation(mode: any) {
    this.modeDTO.idToDelete = mode.id;
    this.commonService.modelConfirmation();
    this.commonService.configFlag.subscribe(flag => {
      if (flag) {
        this.onDelete(this.modeDTO.idToDelete);
      }
      this.commonService.configFlag = new BehaviorSubject(false);
    });
  }
  onDelete(data: number) {
    this.modeDTO.skId = localStorage.getItem('technology');

    this.modeService.delete(data, this.modeDTO.skId).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.reset();
    },
      (error) => {

        if (error.message === ModeSystemRecords.SYSTEMRECORD) {
          this.notify.showWarning('System Default Record Cannot Be Deleted');
        } else {
          this.notify.showError(error.message);
        }

      });
  }
  modePressureValue(val: any) {
    if (val === null) {
      this.modeDTO.pressureVal = NaN;
      this.modeDTO.ddPressure = null;

    } else {
      this.mode.pressure = val.baseValue;
      this.modeDTO.pressureVal = val.displayValue;
      this.modeDTO.ddPressure = val.defaultUnitText;
      this.modeDTO.uomFlag = true;
      this.modeDTO.uomDirty = true;
    }
    ((this.modeDTO.controlVal === undefined) ||
      (this.modeDTO.sulfidingVal === undefined)) ? this.modeDTO.uomFlag = false : this.modeDTO.uomFlag = true;

    this.updateDescUOMChange('', '', this.mode);
  }

  modeLhsvValue(val: any) {
    if (val === null) {
      this.modeDTO.controlVal = NaN;
      this.modeDTO.ddControl = null;
    } else {
      this.mode.lhsv = val.baseValue;
      this.modeDTO.controlVal = val.displayValue;
      this.modeDTO.ddControl = val.defaultUnitText;
      this.modeDTO.uomFlag = true;
      this.modeDTO.uomDirty = true;
    }
    ((this.modeDTO.pressureVal === undefined) ||
      (this.modeDTO.sulfidingVal === undefined)) ? this.modeDTO.uomFlag = false : this.modeDTO.uomFlag = true;

    this.updateDescUOMChange('', '', this.mode);
  }

  modeScfbValue(val: any) {
    if (val === null) {
      this.modeDTO.sulfidingVal = NaN;
      this.modeDTO.ddsulfiding = null;
    } else {
      this.mode.scfb = val.baseValue;
      this.modeDTO.sulfidingVal = val.displayValue;
      this.modeDTO.ddsulfiding = val.defaultUnitText;
      this.modeDTO.uomFlag = true;
      this.modeDTO.uomDirty = true;
    }
    ((this.modeDTO.pressureVal === undefined) ||
      (this.modeDTO.controlVal === undefined)) ? this.modeDTO.uomFlag = false : this.modeDTO.uomFlag = true;

    this.updateDescUOMChange('', '', this.mode);
  }
  updateDescUOMChange(id: any, param: any, mode: any) {

    if (mode.modeDescription === null || mode.modeDescription === undefined) {
      mode.modeDescription = '';
    }
    if (param === ModeDescription.MODETYPE) {

      this.modeDTO.modeDataList.forEach(data => {
        if (data.id === id) {
          this.modeDTO.ModeValue = data.objectiveName;
        }
      });

    }

    if (param === ModeDescription.CONTROLTYPE) {

      this.modeDTO.controlDataList.forEach(data => {
        if (data.id === id) {
          this.modeDTO.controlValue = data.controlName;
        }
      });

    }
    if (param === ModeDescription.SULFIDINGTYPE) {

      this.modeDTO.sulfidingDataList.forEach(data => {
        if (data.id === id) {
          this.modeDTO.sulfidingValue = data.sulfindingName;
        }
      });
    }
    mode.modeDescription =
      ((this.modeDTO.ModeValue == null || this.modeDTO.ModeValue === undefined) ?
        '' : this.modeDTO.ModeValue + ' ' + ModeDescription.MODE) +
      ((this.modeDTO.controlValue == null || this.modeDTO.controlValue === undefined) ?
        '' : ',' + ' ' + this.modeDTO.controlValue + ' ' + ModeDescription.CONTROL) +
      ((this.modeDTO.sulfidingValue == null || this.modeDTO.sulfidingValue === undefined) ?
        '' : ',' + ' ' + this.modeDTO.sulfidingValue + ' ' + ModeDescription.SULFINDING) +
      ((this.modeDTO.pressureVal == null || this.modeDTO.pressureVal === undefined) ?
        '' : ',' + ' ' + this.modeDTO.pressureVal)
      + ((this.modeDTO.ddPressure == null || this.modeDTO.ddPressure === undefined) ?
        '' : ' ' + this.modeDTO.ddPressure)
      + ((this.modeDTO.controlVal == null || this.modeDTO.controlVal === undefined) ?
        '' : ',' + ' ' + this.modeDTO.controlVal) + ((this.modeDTO.ddControl == null || this.modeDTO.ddControl === undefined) ?
          '' : ' ' + this.modeDTO.ddControl)
      + ((this.modeDTO.sulfidingVal == null || this.modeDTO.sulfidingVal === undefined) ?
        '' : ',' + ' ' + this.modeDTO.sulfidingVal) + ((this.modeDTO.ddsulfiding == null || this.modeDTO.ddsulfiding === undefined) ?
          '' : ' ' + this.modeDTO.ddsulfiding) +
      ((this.mode.condition === undefined) ? '' : ',' + ' ' + ModeDescription.TWOWC + this.mode.condition);
    if (
      (this.modeDTO.controlVal === ModeDescription.NIRNET || this.modeDTO.controlVal === ModeDescription.NIRGROSS) &&
      (this.mode.condition != null || this.mode.condition !== undefined)) {
      mode.modeDescription = mode.modeDescription + ModeDescription.CONVERESIONS;
    } else if (this.modeDTO.controlVal === (this.modeDTO.controlVal === ModeDescription.TEMP
      && (this.mode.condition != null || this.mode.condition !== undefined))) {
      mode.modeDescription = mode.modeDescription + ' ' + ModeDescription.TEMP;
    }
  }

  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.modeDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.modeService.loading = false;
        this.modeDTO.uomFlag = false;
        this.modeDTO.uomDirty = false;
        this.getTechnologies();
        this.getmode();
        this.getControl();
        this.getSulfiding();
        this.modeFormControls();
        this.modeDTO.nOfRecordPage = 10;
        this.modeDTO.totalRecords = 10;
        this.modeDTO.columns = [
          { field: 'modeNumber', header: 'Mode#' },
          { field: 'modeDescription', header: 'Description' },
          { field: 'objectiveName', header: 'Mode' },
          { field: 'controlName', header: 'Control' },
          { field: 'sulfindingName', header: 'Sulfiding' },
          { field: 'condition', header: 'Conditions' }
        ];
        if (this.modeDTO.privilege) {
          this.modeDTO.columns.push({ field: 'action', header: 'Action' });
        }
        this.modeDTO.modeForm.reset();
      }
      this.getModeGridList();
    });
  }
}
