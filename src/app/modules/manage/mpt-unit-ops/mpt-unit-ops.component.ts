import { Component, OnInit } from '@angular/core';
import { MptUnitOps, MptUnitOpsDTO, saveObj } from './mpt-unit-ops.model';
import { FormBuilder, FormControl} from '@angular/forms';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { MptUnitOpsService } from './mpt-unit-ops.service';
import { CommonService } from '../../../shared/common-services/common.service';
import { StatusEnum } from '../../../shared/enum/enum.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-mpt-unit-ops',
  templateUrl: './mpt-unit-ops.component.html'
})
export class MPTUnitOpsComponent implements OnInit {
  mpt: MptUnitOps = new MptUnitOps();
  mptUnitsDTO: MptUnitOpsDTO = new MptUnitOpsDTO();
  dataObj = {
    'technologyId': null,
    'unitOperationId': []
  };
  obj: saveObj;
  constructor(private commonService: CommonService, private formBuilder: FormBuilder, private dashboardService: DashboadrdService,
    private notify: NotificationService, private mptUnitsService: MptUnitOpsService, private router: ActivatedRoute) {
    this.mptUnitsDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;
    this.mptUnitsDTO.loading = true;
    this.mptUnitFromControls();
    this.getAllTechnology();
    this.getActiveUnitOps();
    this.refresh();

  }
  getOperationsList() {
    this.mptUnitsService.getAllMptUnits().subscribe(result => {
      this.mptUnitsDTO.operationsList = result.data;
      this.notify.showSuccess(result.message);

    }, error => {
      this.notify.showError(error.message);

    });

  }

  getActiveUnitOps() {
    this.mptUnitsDTO.loading = true;
    this.mptUnitsService.getAllMptUnits().subscribe(result => {
      this.mptUnitsDTO.operationsList = result.data;
      this.mptUnitsDTO.operationsCheckList =  this.mptUnitsDTO.operationsList.unitOperationId;
      this.mptUnitsDTO.loading = false;
    }, error => {
      this.mptUnitsDTO.loading = false;
      this.notify.showError(error.message);
    });
  }
  mptUnitFromControls() {
    this.mptUnitsDTO.mptUnitsForm = this.formBuilder.group(
      {
        catalystTechnology: new FormControl('')
      }
    );

  }
  getAllTechnology() {
    const selectedTechnology = localStorage.getItem('technology');
    this.mpt.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.mpt.technology = result.data;
      this.mpt.technology = this.mpt.technology.filter(tech => tech.technologyId === selectedTechnology);
      this.mpt.technology = this.mpt.technology.filter(val => val.status === StatusEnum.Y);
    }, error => {
      this.notify.showError(error.message);
    });
  }
  saveMptOpsData(data: any) {
    const saveData = [];
    data.forEach(element => {
      if (element.isChecked === true) {
        saveData.push(element);

      }
    });
    this.mptUnitsDTO.operationsList.unitOperationId = saveData;
    this.mptUnitsService.save(this.mptUnitsDTO.operationsList).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.getActiveUnitOps();
      this.getAllTechnology();

    }, error => {
      this.notify.showError(error.message);

    });
  }
  onReset() {
    this.mptUnitsDTO.mptUnitsForm.reset();
    this.mpt.technologyId = localStorage.getItem('technology');
    this.getActiveUnitOps();
    this.getAllTechnology();
    this.commonService.sendToggleFlag(true);

  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.dashboardService.showTechnologyHeader = true;
        this.mptUnitsDTO.loading = true;
        this.mptUnitFromControls();
        this.getAllTechnology();
        this.getActiveUnitOps();
        this.mptUnitsDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
      }
    });
  }
}
