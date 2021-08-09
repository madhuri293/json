import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CatalystState, CatalystStateDTO } from './catalyststate.model';
import { CatalystStateService } from './catalyst-state.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
@Component({
  selector: 'app-catalyst-state',
  templateUrl: './catalyst-state.component.html'
})
export class CatalystStateComponent implements OnInit {
  catalystState: CatalystState = new CatalystState();
  catalystStateDto: CatalystStateDTO = new CatalystStateDTO();



  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private router: ActivatedRoute,
    private catalystStateService: CatalystStateService, private bsModalService: BsModalService,
    private notify: NotificationService, private dashboardService: DashboadrdService) {
    this.catalystStateDto.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.catalystStateDto.isEnable = false;
    this.catalystStateDto.catalystStateList = true;
    this.catalystStateDto.nOfRecordPage = 10;

    this.catalystStateFromControls();
    this.getCatalystStateList();
    this.catalystStateDto.cols = [
      { field: 'stateName', header: 'Catalyst State' },
      { field: 'sulfidingStatus', header: 'Sulfiding / Reduction Indicator' },
      { field: 'status', header: 'Status' },

    ];
    if (this.catalystStateDto.privilege) {
      this.catalystStateDto.cols.push({ field: 'Delete', header: 'Action' });
    }
    this.getStatus();
    this.getSulfidingIndicator();
  }

  getStatus() {
    this.catalystStateDto.statusList = this.commonService.getStatusList();
  }
  getSulfidingIndicator() {
    this.catalystStateDto.sulfidingIndicatorList = this.commonService.getDiluentStatusList();
  }

  catalystStateFromControls() {
    this.catalystStateDto.catalystForm = this.formBuilder.group(
      {
        catalystStateName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100),
        Validators.pattern(SPACE_REGEXP)])),
        sulfidingStatus: new FormControl('', Validators.compose([Validators.required])),
        status: new FormControl('', Validators.compose([Validators.required])),

      }
    );

  }

  onResetClick() {
    this.catalystStateDto.isEnable = false;
    this.catalystStateDto.totalRecords = 0;

    this.catalystState = new CatalystState();
    this.catalystStateDto.catalystForm.reset();
    this.getCatalystStateList();


  }

  deleteConfirmation(catalyst: any) {
    this.catalystStateDto.idToDelete = catalyst.id;
    const sk = catalyst.sk;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onCatalystStateDelete(this.catalystStateDto.idToDelete, sk);
      }
    });
  }
  onCatalystStateDelete(data: number, sk: any) {
    this.catalystStateService.delete(data, sk).subscribe(result => {
      this.catalystState = new CatalystState();
      this.catalystStateDto.catalystForm.reset();
      this.getCatalystStateList();
      this.notify.showSuccess(result.body.message);
    },
      (error) => {
        this.notify.showError(error.message);
      });

  }



  getCatalystStateList() {
    this.catalystStateDto.loading = true;

    this.catalystStateService.getAllCatalystState().subscribe(result => {
      this.catalystStateDto.loading = false;
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
        data.sulfidingStatus = this.commonService.getSulfidingStatusList(data);
      });


      this.catalystStateDto.rows = result.data;
      this.catalystStateDto.catalystStateList = this.catalystStateDto.rows.length;
      this.catalystStateDto.totalRecords = result.data.length;
    },
      (error) => {
        this.catalystStateDto.loading = false;
        this.notify.showError(error.message);

      });

  }

  catalystStateSave(catalystState: any) {
    this.catalystStateDto.isEnable = false;



    if (catalystState.id) {
      catalystState.status = this.commonService.getStatusToFind(catalystState);
      catalystState.sulfidingStatus = this.commonService.getSulfidingStatus(catalystState);

      this.catalystStateService.update(catalystState).subscribe(result => {
        this.catalystStateDto.totalRecords = 0;

        this.notify.showSuccess(result.body.message);
        this.onResetClick();

      },
        (error) => {


          this.notify.showError(error.message);
          catalystState.status = this.commonService.getStatus(catalystState);
          catalystState.sulfidingStatus = this.commonService.getSulfidingStatusList(catalystState);
        });

    } else {
      catalystState.status = this.commonService.getStatusToFind(catalystState);
      catalystState.sulfidingStatus = this.commonService.getSulfidingStatus(catalystState);

      this.catalystStateService.save(catalystState).subscribe(result => {
        this.notify.showSuccess(result.body.message);
        this.catalystStateDto.totalRecords = 0;

        this.onResetClick();

      }, (error) => {


        this.notify.showError(error.message);
        catalystState.status = this.commonService.getStatus(catalystState);
        catalystState.sulfidingStatus = this.commonService.getSulfidingStatusList(catalystState);
      });
    }

  }

  find(catalyst: any) {
    this.catalystStateDto.catalystStateList = 0;
    this.catalystStateDto.totalRecords = 0;
    if (catalyst.status) {
      catalyst.status = this.commonService.getStatusToFind(catalyst);
    }

    if (catalyst.sulfidingStatus) {
      catalyst.sulfidingStatus = this.commonService.getSulfidingStatus(catalyst);
    }
    if (this.catalystStateDto.catalystForm.valid || this.catalystStateDto.catalystForm.dirty) {
      this.catalystStateDto.rows = [];
      this.catalystStateDto.loading = true;
      this.catalystStateService.find(catalyst).subscribe(result => {
        this.catalystStateDto.loading = false;
        if (result.body.data === false) {
          this.catalystStateDto.rows = [];
        } else {
          this.catalystStateDto.rows = result.body.data;
        }
        result.body.data.forEach(data => {
          data.status = this.commonService.getStatus(data);
          data.sulfidingStatus = this.commonService.getSulfidingStatusList(data);
        });

        if (catalyst.status) {
          catalyst.status = this.commonService.getStatus(catalyst);
        }
        if (catalyst.sulfidingStatus) {
          catalyst.sulfidingStatus = this.commonService.getSulfidingStatusList(catalyst);
        }
        this.catalystState = catalyst;
        if (result.body.data.length === 0) {
          this.catalystStateDto.catalystStateList = result.body.data.length;
          this.catalystStateDto.numberOfRecords = this.catalystStateDto.catalystStateList;

        } else {
          this.catalystStateDto.catalystStateList = result.body.data;
          this.catalystStateDto.numberOfRecords = this.catalystStateDto.catalystStateList.length;

        }
        this.catalystStateDto.totalRecords = result.body.data.length;
        this.notify.showSuccess(result.body.message);
      },
        (error) => {
          this.catalystStateDto.loading = false;
          this.catalystStateDto.catalystStateList = 0;
          this.catalystStateDto.totalRecords = 0;
          this.notify.showError(error.message);

          if (catalyst.status) {
            catalyst.status = this.commonService.getStatus(catalyst);
          }
          if (catalyst.sulfidingStatus) {
            catalyst.sulfidingStatus = this.commonService.getSulfidingStatusList(catalyst);
          }

          this.catalystState = catalyst;

        });
    } else {
      this.catalystStateDto.catalystForm.reset();
      this.notify.showError('Enter at least one field to search');
    }

  }




  onRoleEditClick(evt: any) {
    this.catalystStateDto.isEnable = true;

    this.catalystState = new CatalystState();
    this.catalystStateService.getById(evt.id).subscribe(catalystData => {
      this.catalystState = catalystData.data;
      this.catalystState.status = this.commonService.getStatus(this.catalystState);
      this.catalystState.sulfidingStatus = this.commonService.getSulfidingStatusList(catalystData.data);
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
}
