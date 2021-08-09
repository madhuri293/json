import { Component, OnInit } from '@angular/core';
import { CatalystScale, CatalystScaleDTO } from './catalyst-scale.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { CatalystScaleService } from './catalyst-scale.service';
import { SPACE_REGEXP, DESC_SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-catalyst-scale',
  templateUrl: './catalyst-scale.component.html'
})
export class CatalystScaleComponent implements OnInit {
  catalystScale: CatalystScale = new CatalystScale();
  catalystScaleDto: CatalystScaleDTO = new CatalystScaleDTO();



  constructor(private catalystscale: CatalystScaleService, private formBuilder: FormBuilder,
    private bsModalService: BsModalService, private commonService: CommonService, private router: ActivatedRoute,
    private notify: NotificationService, private dashboardService: DashboadrdService) {
    this.catalystScaleDto.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }
  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.catalystScaleDto.isEnable = false;
    this.catalystScaleDto.loading = true;
    this.catalystScaleDto.nOfRecordPage = 10;
    this.limsFromControls();
    this.getcatalystScaleList();
    this.getStatus();
    this.catalystScaleDto.columns = [

      { field: 'scaleName', header: ' Catalyst Scale' },
      { field: 'description', header: 'Catalyst Scale Description' },
      { field: 'status', header: 'Status' },


    ];

    if (this.catalystScaleDto.privilege) {
      this.catalystScaleDto.columns.push({ field: 'delete', header: 'Action' });
    }

  }
  getStatus() {
    this.catalystScaleDto.statusList = this.commonService.getStatusList();
  }
  limsFromControls() {
    this.catalystScaleDto.catalystScaleForm = this.formBuilder.group(
      {
        catalystScaleName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255),
        Validators.pattern(SPACE_REGEXP)])),
        catalystScaleDescription: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(500),
        Validators.pattern(DESC_SPACE_REGEXP)])),
        status: new FormControl('', Validators.compose([Validators.required])),

      }
    );
  }

  saveCatalystScaleData(catalystScale: any) {
    this.catalystScaleDto.isEnable = false;
    this.catalystScaleDto.isDisabled = true;

    if (catalystScale.id) {
      catalystScale.status = this.commonService.getStatusToFind(catalystScale);
      this.catalystscale.update(catalystScale).subscribe(result => {
        this.catalystScaleDto.totalRecords =0;

        this.catalystScaleDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();

      },
        (error) => {
          this.catalystScaleDto.isDisabled = false;
          this.notify.showError(error.message);
          catalystScale.status = this.commonService.getStatus(catalystScale);
        });
    } else {
      catalystScale.status = this.commonService.getStatusToFind(catalystScale);


      this.catalystscale.save(catalystScale).subscribe(result => {
        this.catalystScaleDto.totalRecords =0;

        this.catalystScaleDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();

      }, (error) => {
        this.catalystScaleDto.isDisabled = false;
        this.notify.showError(error.message);
        catalystScale.status = this.commonService.getStatus(catalystScale);
        this.catalystScale = catalystScale;
      });
    }

  }
  getcatalystScaleList() {
    this.catalystScaleDto.loading = true;
    this.catalystscale.getAllCatalystScale().subscribe(result => {
      this.catalystScaleDto.loading = false;
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.catalystScaleDto.rows = result.data;
      this.catalystScaleDto.totalRecords = this.catalystScaleDto.rows.length;
      this.catalystScaleDto.numberOfRecords = this.catalystScaleDto.rows.length;
    },
      (error) => {
        this.catalystScaleDto.loading = false;
        this.notify.showError(error.message);
      });
  }

  onResetClick() {
    this.catalystScaleDto.isEnable = false;
    this.catalystScaleDto.totalRecords =0;

    this.getcatalystScaleList();
    this.catalystScale = new CatalystScale();
    this.catalystScaleDto.catalystScaleForm.reset();
  }
  onRoleEditClick(evt: any) {
    this.catalystScaleDto.isEnable = true;
    this.catalystScaleDto.isDisabled = false;
    this.catalystScale = new CatalystScale();
    this.catalystscale.getById(evt.id).subscribe(role => {
      this.catalystScale = role.data;
      this.catalystScale.status = this.commonService.getStatus(this.catalystScale);
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  onCatalystScaleDelete(data: number, id: any) {
    this.catalystscale.delete(data, id).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.catalystScale = new CatalystScale();
      this.catalystScaleDto.catalystScaleForm.reset();
      this.getcatalystScaleList();
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }



  find(catalystScale: any) {
    this.catalystScaleDto.catalystScaleList = 0;
    this.catalystScaleDto.totalRecords =0;
    if (catalystScale.status) {
      catalystScale.status = this.commonService.getStatusToFind(catalystScale);
    }

    if (this.catalystScaleDto.catalystScaleForm.valid || this.catalystScaleDto.catalystScaleForm.dirty) {
      this.catalystScaleDto.rows = [];
      this.catalystScaleDto.loading = true;
      this.catalystscale.findRole(catalystScale).subscribe(result => {
        if (result.body.data === false) {
          this.catalystScaleDto.rows = [];
        } else {
          this.catalystScaleDto.rows = result.body.data;
        }
        this.catalystScaleDto.rows.forEach(data => {
          data.status = this.commonService.getStatus(data);
        });

        if (catalystScale.status) {
          catalystScale.status = this.commonService.getStatus(catalystScale);
        }

        this.catalystScale = catalystScale;
        if (result.body.data.length === 0) {
          this.catalystScaleDto.catalystScaleList = result.body.data.length;
          this.catalystScaleDto.numberOfRecords = this.catalystScaleDto.catalystScaleList;

        } else {
          this.catalystScaleDto.catalystScaleList = result.body.data;
          this.catalystScaleDto.numberOfRecords = this.catalystScaleDto.catalystScaleList.length;
        }

        this.catalystScaleDto.totalRecords = result.body.data.length;
        this.notify.showSuccess(result.body.message);
        this.catalystScaleDto.loading = false;
      },
        (error) => {
          this.catalystScaleDto.loading = false;
          this.catalystScaleDto.catalystScaleList = null;
          this.catalystScaleDto.totalRecords = 0;
          this.notify.showError(error.message);
          if (catalystScale.status) {
            catalystScale.status = this.commonService.getStatus(catalystScale);
          }
          this.catalystScale = catalystScale;
        });
    } else {
      this.catalystScaleDto.catalystScaleForm.reset();
      this.notify.showError('Enter at least one field to search');
    }
  }
  deleteConfirmation(catalystScale: any) {
    this.catalystScaleDto.idToDelete = catalystScale.id;
    this.catalystScaleDto.skId = catalystScale.id;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onCatalystScaleDelete(this.catalystScaleDto.idToDelete, this.catalystScaleDto.skId);
      }
    });
  }

}
