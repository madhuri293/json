import { Component, OnInit } from '@angular/core';
import { TechnologyService } from './technology.service';
import { Technology, TechnologyDTO } from './technology.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { CommonService } from '../../../shared/common-services/common.service';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { Router, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html'
})
export class TechnologyComponent implements OnInit {


  technologyDTO: TechnologyDTO = new TechnologyDTO();
  mySubscription: any;
  constructor(private notify: NotificationService,
    private route: Router,
    public technologyService: TechnologyService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private dashboardService: DashboadrdService,
    private bsModalService: BsModalService,
    private router: ActivatedRoute,
    public location: Location) {
    this.dashboardService.sendHideFlag(true);
    this.technologyDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.technologyDTO.nOfRecordPage = 10;
    this.dashboardService.showTechnologyHeader = true;
    this.getTechnologies();
    this.technologyFromControls();
    this.getTableColumnData();
    this.getStatus();
    this.refresh();
  }
  getStatus() {
    this.technologyDTO.statusList = this.commonService.getStatusList();
  }
  technologyFromControls() {
    this.technologyDTO.technologyForm = this.formBuilder.group(
      {
        technologyName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(30),
        Validators.pattern(/^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$/)
        ])),
        technologyCode: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10),
        Validators.pattern(/^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$/)
        ])),
        technologyDescription: new FormControl('', Validators.compose([Validators.maxLength(100)])),
        technologyColorCode: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
        status: new FormControl('', Validators.compose([Validators.required]))
      }
    );
  }

  getTableColumnData() {
    this.technologyDTO.colsData = [
      { field: 'technologyCode', header: 'Technology Code' },
      { field: 'technologyName', header: 'Technology Name' },
      { field: 'description', header: 'Technology Description' },
      { field: 'colorCode', header: 'Technology Color Code' },
      { field: 'status', header: 'Status' }
    ];
    if (this.technologyDTO.privilege) {
      this.technologyDTO.colsData.push(
        { field: 'Action', header: 'Action' }
      );
    }
  }

  getTechnologies() {
    this.technologyService.loading = true;
    this.technologyService.getAll().subscribe(result => {
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.technologyDTO.technologyList = result.data;
      this.technologyDTO.totalRecords = this.technologyDTO.technologyList.length;
      this.technologyService.loading = false;

    },
      (error) => {
        this.technologyService.loading = false;
      });

  }


  saveTechnology(technology: any) {
    this.technologyDTO.isDisabled = true;
    if (technology.id) {
      this.technologyService.update(technology).subscribe(result => {
        if (result) {
          this.onResetClick();
          this.technologyDTO.isDisabled = false;
          this.notify.showSuccess(result.body.message);
        } else {
          this.notify.showError(result.body.message);
        }
      },
        (error) => {
          this.technologyDTO.isDisabled = false;
          this.notify.showError(error.message);
        });
    } else {
      this.technologyService.save(technology).subscribe(result => {
        if (result) {
          this.onResetClick();
          this.technologyDTO.isDisabled = false;
          this.notify.showSuccess(result.body.message);
        }
      }, error => {
        this.technologyDTO.isDisabled = false;
        this.notify.showError(error.message);
      });
    }
  }


  onTechnologyEditClick(data: any) {
    this.technologyService.loading = true;
    this.technologyDTO.isDisabled = false;
    this.technologyService.getById(data.id).subscribe(
      result => {
        this.technologyDTO.technology = result.data;
      }, error => {
        this.notify.showError(error.message);
      });
    this.technologyService.loading = false;
  }

  findTechnology(technology: any) {
    if (this.technologyDTO.technologyForm.dirty || this.technologyDTO.technologyForm.valid || this.technologyDTO.technology.colorCode) {
      this.technologyService.loading = true;
      this.technologyService.findTechnology(technology).subscribe(result => {
        if (result) {
          this.notify.showSuccess(result.body.message);
          this.technologyDTO.technologyList = result.body.data;
          this.technologyDTO.technologyDetail = this.technologyDTO.technologyList;
          this.technologyDTO.totalRecords = this.technologyDTO.technologyList.length;
          this.commonService.sendToggleFlag(true);

          this.technologyDTO.technologyDetail.forEach((res: any) => {
            res.status = this.commonService.getStatus(res);
          });
        } else {
          this.notify.showError(result.body.message);
        }
        this.technologyService.loading = false;

      }, (error) => {
        this.technologyDTO.technologyDetail = null;
        this.notify.showError(error.message);
        this.technologyService.loading = false;
      });
    } else {
      this.notify.showError('Please enter at least one field to search');
    }

  }

  deleteConfirmation(technology: any) {
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((flag: boolean) => {
      if (flag) {
        this.technologyDTO.techId = technology.id;
        this.technologyDTO.skId = technology.sk;
        this.technologyService.delete(this.technologyDTO.techId, this.technologyDTO.skId).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.onResetClick();
          this.technologyDTO.totalRecords = this.technologyDTO.technologyList.length;
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
    });

  }

  onResetClick() {
    this.getTechnologies();
    this.technologyDTO.technology = new Technology();
    this.technologyDTO.technologyForm.reset();
    this.commonService.sendToggleFlag(true);
  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.technologyDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.technologyDTO.totalRecords = 10;
        this.technologyDTO.nOfRecordPage = 10;
        this.technologyService.loading = true;
        this.dashboardService.showTechnologyHeader = true;
        this.getTechnologies();
        this.technologyFromControls();
        this.getTableColumnData();
        this.getStatus();
      }
    });
  }


}
