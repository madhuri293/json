import { Component, OnInit } from '@angular/core';
import { CatalystSize, CatalystSizeDTO } from './catalyst-size.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { CatalystSizeService } from './catalyst-size.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-catalyst-size',
  templateUrl: './catalyst-size.component.html'
})
export class CatalystSizeComponent implements OnInit {
  catalystSize: CatalystSize = new CatalystSize();
  catalystSizeDto: CatalystSizeDTO = new CatalystSizeDTO();


  constructor(private catalystsizeService: CatalystSizeService, private commonService: CommonService,
    private bsModalService: BsModalService, private formBuilder: FormBuilder, private router: ActivatedRoute,
    private notify: NotificationService, private dashboardService: DashboadrdService) {
    this.catalystSizeDto.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.catalystSizeDto.isEnable = false;
    this.catalystSizeDto.nOfRecordPage = 10;

    this.limsFromControls();
    this.getcatalystSizeList();
    this.catalystSizeDto.columns = [

      { field: 'sizeCode', header: ' Catalyst Size' },
      { field: 'status', header: 'Status' },
    ];
    if (this.catalystSizeDto.privilege) {
      this.catalystSizeDto.columns.push({ field: 'delete', header: 'Action' });
    }

    this.getStatus();
  }

  getStatus() {
    this.catalystSizeDto.statusList = this.commonService.getStatusList();
  }

  limsFromControls() {
    this.catalystSizeDto.catalystSizeForm = this.formBuilder.group(
      {
        catalystSizeCode: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10),
        Validators.pattern(SPACE_REGEXP)])),
        status: new FormControl('', Validators.compose([Validators.required])),

      }
    );

  }


  saveCatalystSizeData(catalystSize: any) {
    this.catalystSizeDto.isEnable = false;
    this.catalystSizeDto.isDisabled = true;

    if (catalystSize.id) {
      catalystSize.status = this.commonService.getStatusToFind(catalystSize);
      this.catalystsizeService.update(catalystSize).subscribe(result => {
        this.catalystSizeDto.isDisabled = false;
        this.catalystSizeDto.totalRecords = 0;

        this.notify.showSuccess(result.body.message);
        this.getcatalystSizeList();

        this.catalystSize = new CatalystSize();
        this.catalystSizeDto.catalystSizeForm.reset();
      },
        (error) => {
          this.catalystSizeDto.isDisabled = false;
          this.notify.showError(error.message);
          catalystSize.status = this.commonService.getStatus(catalystSize);
        });
    } else {
      catalystSize.status = this.commonService.getStatusToFind(catalystSize);
      this.catalystsizeService.save(catalystSize).subscribe(result => {
        this.catalystSizeDto.totalRecords = 0;

        this.catalystSizeDto.isDisabled = false;

        this.notify.showSuccess(result.body.message);
        this.getcatalystSizeList();
        this.catalystSize = new CatalystSize();
        this.catalystSizeDto.catalystSizeForm.reset();
      }, (error) => {
        this.catalystSizeDto.isDisabled = false;
        this.notify.showError(error.message);
        catalystSize.status = this.commonService.getStatus(catalystSize);
      });
    }

  }
  getcatalystSizeList() {
    this.catalystSizeDto.loading = true;

    this.catalystsizeService.getAllCatalystSize().subscribe(result => {
      this.catalystSizeDto.loading = false;
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.catalystSizeDto.rows = result.data;
      this.catalystSizeDto.totalRecords = this.catalystSizeDto.rows.length;
      this.catalystSizeDto.numberOfRecords = this.catalystSizeDto.rows.length;
    },
      (error) => {
        this.catalystSizeDto.loading = false;
        this.notify.showError(error.message);
      });
  }

  onResetClick() {
    this.catalystSizeDto.isEnable = false;
    this.catalystSizeDto.totalRecords = 0;

    this.getcatalystSizeList();
    this.catalystSize = new CatalystSize();
    this.catalystSizeDto.catalystSizeForm.reset();

  }
  onRoleEditClick(evt: any) {
    this.catalystSizeDto.isEnable = true;
    this.catalystSizeDto.isDisabled = false;
    this.catalystSize = new CatalystSize();
    this.catalystsizeService.getById(evt.id).subscribe(role => {
      this.catalystSize = role.data;
      this.catalystSize.status = this.commonService.getStatus(this.catalystSize);
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  onCatalystSizeDelete(data: number, skId: number) {
    this.catalystsizeService.delete(data, skId).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.catalystSize = new CatalystSize();
      this.catalystSizeDto.catalystSizeForm.reset();
      this.getcatalystSizeList();
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  find(catalystSize: any) {
    this.catalystSizeDto.catalystSizeList = 0;
    this.catalystSizeDto.totalRecords = 0;
    if (catalystSize.status) {
      catalystSize.status = this.commonService.getStatusToFind(catalystSize);
    }
    if (this.catalystSizeDto.catalystSizeForm.valid || this.catalystSizeDto.catalystSizeForm.dirty) {
      this.catalystSizeDto.rows = [];
      this.catalystSizeDto.loading = true;
      this.catalystsizeService.findRole(catalystSize).subscribe(result => {
        this.catalystSizeDto.rows = result.body.data;
        result.body.data.forEach(data => {
          data.status = this.commonService.getStatus(data);
        });
        if (catalystSize.status) {
          catalystSize.status = this.commonService.getStatus(catalystSize);
        }
        this.catalystSize = catalystSize;
        if (result.body.data.length === 0) {
          this.catalystSizeDto.catalystSizeList = result.body.data.length;
          this.catalystSizeDto.numberOfRecords = this.catalystSizeDto.catalystSizeList;

        } else {
          this.catalystSizeDto.catalystSizeList = result.body.data;
          this.catalystSizeDto.numberOfRecords = this.catalystSizeDto.catalystSizeList.length;

        }
        this.catalystSizeDto.totalRecords = result.body.data.length;
        this.notify.showSuccess(result.body.message);
        this.catalystSizeDto.loading = false;
      },
        (error) => {
          this.catalystSizeDto.loading = false;
          this.catalystSizeDto.catalystSizeList = 0;
          this.catalystSizeDto.totalRecords = 0;
          if (catalystSize.status) {
            catalystSize.status = this.commonService.getStatus(catalystSize);
          }
          this.catalystSize = catalystSize;
          this.notify.showError(error.message);
        });
    } else {
      this.catalystSizeDto.catalystSizeForm.reset();
      this.notify.showError('Enter at least one field to search');
    }
  }
  deleteConfirmation(catalystSize: any) {
    this.catalystSizeDto.idToDelete = catalystSize.id;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onCatalystSizeDelete(this.catalystSizeDto.idToDelete, catalystSize.id);
      }
    });
  }





}
