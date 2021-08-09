import { Component, OnInit } from '@angular/core';
import { CatalystApplicationDTO, CatalystApplication } from './catalyst.application.model';
import { FormBuilder, Validators } from '@angular/forms';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CatalystTypeService } from '../catalyst-type/catalyst-type.service';
import { CatalystApplicationService } from './catalyst-application.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-catalyst-application',
  templateUrl: './catalyst-application.component.html'
})
export class CatalystApplicationComponent implements OnInit {
  catalystApplicationDTO: CatalystApplicationDTO = new CatalystApplicationDTO();
  catalystApplication: CatalystApplication = new CatalystApplication();
  constructor(private formBuilder: FormBuilder,
    public catalystTypeService: CatalystTypeService,
    public catalystApplicationService: CatalystApplicationService,
    private notify: NotificationService,
    public commonService: CommonService,
    public bsModalService: BsModalService,
    public router: ActivatedRoute,
    private dashboardService: DashboadrdService) {
    this.catalystApplicationDTO.privilege = this.commonService.applyPrivilege(router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;

    this.buildForm();
    this.getCatalystType();
    this.getCatalystApplicationList();
    this.catalystApplicationDTO.nOfRecords = 10;
    this.getStatus();
  }

  buildForm() {
    this.catalystApplicationDTO.catalystApplicationForm = this.formBuilder.group({
      applicationName: ['', Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern(SPACE_REGEXP)])],
      catalystType: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(100)])],
      status: ['', Validators.compose([Validators.required])],
    });
  }
  getStatus() {
    this.catalystApplicationDTO.statusList = this.commonService.getStatusList();
  }
  getCatalystType() {
    this.catalystTypeService.getAllActiveCatalystType().subscribe(typeList => {
      this.catalystApplicationDTO.catalystTypeList = typeList.data;
    });
  }

  getCatalystApplicationList() {
    this.catalystApplicationService.loading = true;
    this.catalystApplicationService.getAllCatalystApplication().subscribe(result => {
      this.catalystApplicationDTO.columns = [
        { field: 'typeName', header: 'Catalyst Type' },
        { field: 'applicationName', header: 'Application Name' },
        { field: 'description', header: 'Description' },
        { field: 'status', header: 'Status' }];
      if (this.catalystApplicationDTO.privilege) {
        this.catalystApplicationDTO.columns.push({ field: 'action', header: 'Action' });
      }
      this.catalystApplicationDTO.catalystApplicationList = result.data;
      this.catalystApplicationDTO.catalystApplicationList.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.catalystApplicationDTO.nOfRecords = 10;
      this.catalystApplicationDTO.totalRecords = this.catalystApplicationDTO.catalystApplicationList.length;
      this.catalystApplicationService.loading = false;
    }, (error) => {
      this.catalystApplicationService.loading = false;
      this.catalystApplicationDTO.totalRecords = 0;
    });
  }

  save(catalystApplication: any) {
    if (catalystApplication.id) {
      this.catalystApplicationService.update(catalystApplication).subscribe(res => {
        this.notify.showSuccess(res.body.message);
        this.catalystApplicationDTO.totalRecords=0;

        this.reset();
      },
        (error) => {
          this.notify.showError(error.message);
        });
    } else {
      this.catalystApplicationService.save(catalystApplication).subscribe(res => {
        this.notify.showSuccess(res.body.message);
        this.catalystApplicationDTO.totalRecords=0;

        this.reset();
      },
        (error) => {
          this.notify.showError(error.message);
        });
    }
  }

  reset() {
    this.catalystApplicationDTO.totalRecords =0
    this.catalystApplication = new CatalystApplication();
    this.getCatalystApplicationList();
    this.catalystApplicationDTO.catalystApplicationForm.reset();
    this.commonService.sendToggleFlag(true);

  }

  deleteConfirmation(catalystApplication: any) {
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((flag: boolean) => {
      if (flag) {
        this.catalystApplicationDTO.applicationId = catalystApplication.id;
        this.catalystApplicationDTO.sk = catalystApplication.sk;
        this.catalystApplicationService.delete(this.catalystApplicationDTO.applicationId, this.catalystApplicationDTO.sk).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.reset();
          this.catalystApplicationDTO.totalRecords = this.catalystApplicationDTO.catalystApplicationList.length;
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
    });

  }

  find(catalystApplication: any) {
    this.catalystApplicationDTO.totalRecords=0;
    if (this.catalystApplicationDTO.catalystApplicationForm.dirty || this.catalystApplicationDTO.catalystApplicationForm.valid) {
      this.catalystApplicationService.loading = true;
      this.catalystApplicationService.find(catalystApplication).subscribe(result => {
        if (result) {
          this.notify.showSuccess(result.body.message);
          this.commonService.sendToggleFlag(true);

          this.catalystApplicationDTO.catalystApplicationList = result.body.data;
          this.catalystApplicationDTO.totalRecords = this.catalystApplicationDTO.catalystApplicationList.length;
          this.catalystApplicationDTO.catalystApplicationList.forEach((res: any) => {
            res.status = this.commonService.getStatus(res);
          });
        } else {
          this.notify.showError(result.body.message);
        }
        this.catalystApplicationService.loading = false;
      }, (error) => {
        this.catalystApplicationDTO.catalystApplicationList = null;
        this.catalystApplicationDTO.totalRecords = 0;
        this.notify.showError(error.message);
        this.catalystApplicationService.loading = false;
      });
    } else {
      this.notify.showError('Please enter at least one field to search');
    }

  }

  edit(catalystApplication: any) {
    this.catalystApplicationService.loading = true;
    this.catalystApplicationService.getById(catalystApplication.id).subscribe(
      result => {
        this.catalystApplication = result.data;
      }, error => {
        this.notify.showError(error.message);
      });
    this.catalystApplicationService.loading = false;
  }

}
