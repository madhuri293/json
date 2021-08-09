import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ManageUnitOps, ManageUnitOpsDTO } from './manage-unit-ops.model';
import { ManageUnitOpsService } from './manage-unit-ops.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { BehaviorSubject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap';
import { CommonService } from '../../../shared/common-services/common.service';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';



@Component({
  selector: 'app-manage-unit-ops',
  templateUrl: './manage-unit-ops.component.html'
})
export class ManageUnitOpsComponent implements OnInit {

  manageUnitOps: ManageUnitOps = new ManageUnitOps();
  manageUnitOpsDTO: ManageUnitOpsDTO = new ManageUnitOpsDTO();

  constructor(private formBuilder: FormBuilder, private manageUnitOpsService: ManageUnitOpsService, private router: ActivatedRoute,
    private notify: NotificationService, private bsModalService: BsModalService,
    private commonService: CommonService, private dashboardService: DashboadrdService) {
    this.manageUnitOpsDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);

  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.manageUnitOpsDTO.loading = true;

    this.manageUnitOpsFromControls();
    this.getManageUnitOpsList();
    this.manageUnitOpsDTO.nOfRecordPage = 10;
    this.manageUnitOpsDTO.unitOps = true;

    this.manageUnitOpsDTO.columns = [
      { field: 'unitOperationName', header: 'Unit Ops Name' },
      { field: 'description', header: 'Unit Ops Description' },
      { field: 'status', header: 'Status' }
    ];

    if (this.manageUnitOpsDTO.privilege) {
      this.manageUnitOpsDTO.columns.push({ field: 'delete', header: 'Action' });
    }
    this.getStatus();

  }
  getStatus() {
    this.manageUnitOpsDTO.statusList = this.commonService.getStatusList();
  }
  manageUnitOpsFromControls() {
    this.manageUnitOpsDTO.manageUnitOpsForm = this.formBuilder.group(
      {
        unitOpsName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(128),
        Validators.pattern(SPACE_REGEXP)])),
        unitOpsDescription: new FormControl('', Validators.compose([Validators.required,Validators.maxLength(128),
        Validators.pattern(SPACE_REGEXP)])),
        status: new FormControl('', Validators.compose([Validators.required])),

      }
    );
  }
  onResetClick() {
    this.getManageUnitOpsList();
    this.manageUnitOps = new ManageUnitOps();
    this.manageUnitOpsDTO.manageUnitOpsForm.reset();
    this.commonService.sendToggleFlag(true);
    this.manageUnitOpsDTO.totalRecords =  0;

  }
  getManageUnitOpsList() {
    this.manageUnitOpsDTO.loading = true;
    this.manageUnitOpsService.getAllManageUnitOps().subscribe(result => {
      this.manageUnitOpsDTO.loading = false;
      result.data.forEach(data => {
        if (data.status === StatusEnum.Y) {
          data.status = StatusEnum.ACTIVE;
        } else {
          data.status = StatusEnum.INACTIVE;
        }

      });
      this.manageUnitOpsDTO.rows = result.data;
      this.manageUnitOpsDTO.manageUnitOpsList = this.manageUnitOpsDTO.rows.slice(0, this.manageUnitOpsDTO.nOfRecordPage);
      this.manageUnitOpsDTO.totalRecords = this.manageUnitOpsDTO.rows.length;
      this.manageUnitOpsDTO.numberOfRecords = this.manageUnitOpsDTO.rows.length;
    },
      (error) => {
        this.manageUnitOpsDTO.loading = false;
        this.notify.showError(error.message);
      });
  }
  onRoleEditClick(evt: any) {
    this.manageUnitOpsDTO.isDisabled = false;
    this.manageUnitOps = new ManageUnitOps();
    this.manageUnitOpsService.getById(evt.id).subscribe(role => {
      this.manageUnitOps = role.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  saveManageUnitOps(manageUnitOps: any) {
    this.manageUnitOpsDTO.loading = true;
    this.manageUnitOpsDTO.isDisabled = true;
    if (manageUnitOps.id) {

      this.manageUnitOpsService.update(manageUnitOps).subscribe(result => {
        this.manageUnitOpsDTO.totalRecords =  0;
        this.manageUnitOpsDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.getManageUnitOpsList();
        this.manageUnitOps = new ManageUnitOps();
        this.manageUnitOpsDTO.manageUnitOpsForm.reset();
        this.manageUnitOpsDTO.loading = false;
      },
        (error) => {
          this.manageUnitOpsDTO.loading = false;
          this.manageUnitOpsDTO.isDisabled = false;
          this.notify.showError(error.message);
        });
    } else {
      this.manageUnitOpsService.save(manageUnitOps).subscribe(result => {
        this.manageUnitOpsDTO.isDisabled = false;
        this.manageUnitOpsDTO.loading = false;
        this.manageUnitOpsDTO.totalRecords =  0;

        this.notify.showSuccess(result.body.message);
        this.getManageUnitOpsList();
        this.manageUnitOps = new ManageUnitOps();
        this.manageUnitOpsDTO.manageUnitOpsForm.reset();
      }, (error) => {
        this.manageUnitOpsDTO.loading = false;
        this.manageUnitOpsDTO.isDisabled = false;
        this.notify.showError(error.message);
        this.manageUnitOps = manageUnitOps;

      });
    }

  }
  find(manageUnitOps: any) {
    this.manageUnitOpsDTO.manageUnitOpsList = 0;
    this.manageUnitOpsDTO.totalRecords =  0;

    if (this.manageUnitOpsDTO.manageUnitOpsForm.valid || this.manageUnitOpsDTO.manageUnitOpsForm.dirty) {
      this.manageUnitOpsDTO.rows = [];
      this.manageUnitOpsDTO.loading = true;
      this.manageUnitOpsService.find(manageUnitOps).subscribe(result => {
        this.manageUnitOpsDTO.rows = result.body.data;
        this.commonService.sendToggleFlag(true);

        this.manageUnitOpsDTO.rows.forEach(data => {
          if (data.status === StatusEnum.Y) {
            data.status = StatusEnum.ACTIVE;
          } else {
            data.status = StatusEnum.INACTIVE;

          }

        });



        this.manageUnitOps = manageUnitOps;
        if (result.body.data.length === 0) {
          this.manageUnitOpsDTO.manageUnitOpsList = result.body.data.length;
          this.manageUnitOpsDTO.numberOfRecords = this.manageUnitOpsDTO.manageUnitOpsList;

        } else {
          this.manageUnitOpsDTO.manageUnitOpsList = result.body.data;
          this.manageUnitOpsDTO.numberOfRecords = this.manageUnitOpsDTO.manageUnitOpsList.length;
        }
        this.manageUnitOpsDTO.totalRecords = result.body.data.length;
        this.notify.showSuccess(result.body.message);
        this.manageUnitOpsDTO.loading = false;
      },
        (error) => {
          this.manageUnitOpsDTO.loading = false;
          this.manageUnitOpsDTO.manageUnitOpsList = null;
          this.manageUnitOpsDTO.totalRecords = 0;
          this.notify.showError(error.message);
          if (manageUnitOps.status) {
            if (manageUnitOps.status === StatusEnum.ACTIVE || manageUnitOps.status === StatusEnum.Y) {
              manageUnitOps.status = StatusEnum.ACTIVE;
            } else {
              manageUnitOps.status = StatusEnum.INACTIVE;
            }
          }
          this.manageUnitOps = manageUnitOps;
        });
    } else {
      this.manageUnitOpsDTO.manageUnitOpsForm.reset();
      this.notify.showError('Enter at least one field to search');
    }
  }


  deleteConfirmation(manageUnit: any) {
    this.manageUnitOpsDTO.idToDelete = manageUnit.id;
    this.manageUnitOpsDTO.skId = manageUnit.id;

    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onManageUnitOpsDelete(this.manageUnitOpsDTO.idToDelete, this.manageUnitOpsDTO.skId);
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });


  }
  onManageUnitOpsDelete(id: any, sk: any) {

    this.manageUnitOpsService.delete(id, sk).subscribe(result => {
      this.manageUnitOps = new ManageUnitOps();
      this.manageUnitOpsDTO.manageUnitOpsForm.reset();
      this.notify.showSuccess(result.body.message);
      this.getManageUnitOpsList();
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

}
