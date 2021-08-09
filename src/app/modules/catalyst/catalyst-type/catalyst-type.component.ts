import { Component, OnInit } from '@angular/core';
import { CatalystType, CatalystTypeDTO } from './catalyst-type.model';
import { CatalystTypeService } from './catalyst-type.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { SPACE_REGEXP, DESC_SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-catalyst-type',
  templateUrl: './catalyst-type.component.html'
})
export class CatalystTypeComponent implements OnInit {
  catalystType: CatalystType = new CatalystType();
  catalystTypeDto: CatalystTypeDTO = new CatalystTypeDTO();


  constructor(private catalystTypeService: CatalystTypeService,
    private router: ActivatedRoute,
    private commonService: CommonService,
    private bsModalService: BsModalService, private formBuilder: FormBuilder,
    private notify: NotificationService, private dashboardService: DashboadrdService) {
    this.catalystTypeDto.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.catalystTypeDto.isEnable = false;
    this.catalystTypeDto.nOfRecordPage = 10;
    this.catalystTypeFromControls();
    this.getcatalystTypeList();
    this.catalystTypeDto.columns = [

      { field: 'typeName', header: ' Catalyst Type' },
      { field: 'description', header: 'Catalyst Type Description' },
      { field: 'status', header: 'Status' }


    ];
    if (this.catalystTypeDto.privilege) {
      this.catalystTypeDto.columns.push({ field: 'delete', header: 'Action' });
    }


    this.getStatus();
  }
  getStatus() {
    this.catalystTypeDto.statusList = this.commonService.getStatusList();
  }
  catalystTypeFromControls() {
    this.catalystTypeDto.catalystTypeForm = this.formBuilder.group(
      {
        catalystTypeName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100),
        Validators.pattern(SPACE_REGEXP)])),
        catalystTypeDescription: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100),
        Validators.pattern(DESC_SPACE_REGEXP)])),
        status: new FormControl('', Validators.compose([Validators.required])),


      }
    );

  }

  saveCatalystTypeData(catalystType: any) {
    this.catalystTypeDto.isEnable = false;
    this.catalystTypeDto.isDisabled = true;
    if (catalystType.id) {
      catalystType.status = this.commonService.getStatusToFind(catalystType);
      this.catalystTypeService.update(catalystType).subscribe(result => {
        this.catalystTypeDto.totalRecords = 0;

        this.catalystTypeDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.getcatalystTypeList();
        this.catalystType = new CatalystType();
        this.catalystTypeDto.catalystTypeForm.reset();
      },
        (error) => {
          this.catalystTypeDto.isDisabled = false;
          this.notify.showError(error.message);
          catalystType.status = this.commonService.getStatus(catalystType);
        });
    } else {
      catalystType.status = this.commonService.getStatusToFind(catalystType);
      this.catalystTypeService.save(catalystType).subscribe(result => {
        this.catalystTypeDto.isDisabled = false;
        this.catalystTypeDto.totalRecords = 0;

        this.notify.showSuccess(result.body.message);
        this.getcatalystTypeList();
        this.catalystType = new CatalystType();
        this.catalystTypeDto.catalystTypeForm.reset();
      }, (error) => {
        this.catalystTypeDto.isDisabled = false;
        this.notify.showError(error.message);
        catalystType.status = this.commonService.getStatus(catalystType);
      });
    }

  }
  getcatalystTypeList() {
    this.catalystTypeDto.loading = true;

    this.catalystTypeService.getAllCatalystType().subscribe(result => {
      this.catalystTypeDto.loading = false;
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.catalystTypeDto.rows = result.data;
      this.catalystTypeDto.totalRecords = this.catalystTypeDto.rows.length;
      this.catalystTypeDto.numberOfRecords = this.catalystTypeDto.rows.length;
    },
      (error) => {
        this.catalystTypeDto.loading = false;
        this.notify.showError(error.message);
      });
  }

  onResetClick() {
    this.catalystTypeDto.isEnable = false;
    this.catalystTypeDto.totalRecords = 0;

    this.getcatalystTypeList();
    this.catalystType = new CatalystType();
    this.catalystTypeDto.catalystTypeForm.reset();

  }
  onRoleEditClick(evt: any) {
    this.catalystTypeDto.isEnable = true;
    this.catalystTypeDto.isDisabled = false;
    this.catalystType = new CatalystType();
    this.catalystTypeService.getById(evt.id).subscribe(role => {
      this.catalystType = role.data;
      this.catalystType.status = this.commonService.getStatus(this.catalystType);
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  onCatalystTypeDelete(data: number, sk: string) {
    this.catalystTypeService.delete(data, sk).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.catalystType = new CatalystType();
      this.catalystTypeDto.catalystTypeForm.reset();
      this.getcatalystTypeList();
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  find(catalystType: any) {
    this.catalystTypeDto.totalRecords = 0;
    if (catalystType.status) {
      catalystType.status = this.commonService.getStatusToFind(catalystType);
    }
    if (this.catalystTypeDto.catalystTypeForm.valid || this.catalystTypeDto.catalystTypeForm.dirty) {
      this.catalystTypeDto.rows = [];
      this.catalystTypeDto.loading = true;
      this.catalystTypeService.findRole(catalystType).subscribe(result => {
        if (result.body.data === false) {
          this.catalystTypeDto.rows = [];
        } else {
          this.catalystTypeDto.rows = result.body.data;
        }
        this.catalystTypeDto.rows.forEach(data => {
          data.status = this.commonService.getStatus(data);
        });
        if (catalystType.status) {
          catalystType.status = this.commonService.getStatus(catalystType);
        }
        this.catalystType = catalystType;
        if (result.body.data.length === 0) {
          this.catalystTypeDto.catalystTypeList = result.body.data.length;
          this.catalystTypeDto.numberOfRecords = this.catalystTypeDto.catalystTypeList;

        } else {
          this.catalystTypeDto.catalystTypeList = result.body.data;
          this.catalystTypeDto.numberOfRecords = this.catalystTypeDto.catalystTypeList.length;

        }
        this.catalystTypeDto.totalRecords = result.body.data.length;
        this.notify.showSuccess(result.body.message);
        this.catalystTypeDto.loading = false;
      },
        (error) => {
          this.catalystTypeDto.loading = false;
          this.catalystTypeDto.catalystTypeList = 0;
          this.catalystTypeDto.totalRecords = 0;
          this.notify.showError(error.message);
          if (catalystType.status) {
            catalystType.status = this.commonService.getStatus(catalystType);
          }
          this.catalystType = catalystType;
        });
    } else {
      this.catalystTypeDto.catalystTypeForm.reset();
      this.notify.showError('Enter at least one field to search');
    }
  }
  deleteConfirmation(catalystType: any) {
    const sk = catalystType.sk;

    this.catalystTypeDto.idToDelete = catalystType.id;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onCatalystTypeDelete(this.catalystTypeDto.idToDelete, sk);
      }
    });
  }
}


