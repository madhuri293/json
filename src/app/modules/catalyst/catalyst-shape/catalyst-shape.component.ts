import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { CatalystShapeService } from './catalyst-shape.service';
import { CatalystShape, CatalystShapeDTO } from './catalyst-shape.model';
import { SPACE_REGEXP, NUMBER_REGEX } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';


@Component({
  selector: 'app-catalyst-shape',
  templateUrl: './catalyst-shape.component.html',
})
export class CatalystShapeComponent implements OnInit {
  catalystShape: CatalystShape = new CatalystShape();
  catalystShapeDto: CatalystShapeDTO = new CatalystShapeDTO();

  @ViewChild('formTemplate') formTemplate: TemplateRef<any>;


  constructor(private catalystShapeService: CatalystShapeService, private commonService: CommonService,
    private bsModalService: BsModalService, private formBuilder: FormBuilder, private router: ActivatedRoute,
    private notify: NotificationService, private dashboardService: DashboadrdService) {
    this.catalystShapeDto.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }
  ngOnInit() {
    this.catalystShapeDto.loading = true;

    this.dashboardService.showTechnologyHeader = false;
    this.catalystShapeDto.isEnable = false;
    this.catalystShapeDto.nOfRecordPage = 10;
    this.catalystShapeFromControls();
    this.getCatalystShapeList();
    this.catalystShapeDto.columns = [

      { field: 'shapeName', header: ' Catalyst Shape' },
      { field: 'assumedVoidFraction', header: 'Assumed Void Fraction' },
      { field: 'crushedFraction', header: 'Crushed Void Fraction' },
      { field: 'status', header: 'Status' }

    ];

    if (this.catalystShapeDto.privilege) {
      this.catalystShapeDto.columns.push({ field: 'delete', header: 'Action' });
    }
    this.getStatus();
  }


  getStatus() {
    this.catalystShapeDto.statusList = this.commonService.getStatusList();
  }
  catalystShapeFromControls() {
    this.catalystShapeDto.catalystShapeForm = this.formBuilder.group(
      {
        catalystShapeName: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP),
        Validators.maxLength(100)])),
        assumedVoidFractionMsr: new FormControl('', Validators.compose([Validators.required, Validators.pattern(NUMBER_REGEX)])),
        crushedFractionMsr: new FormControl('', Validators.compose([Validators.required, Validators.pattern(NUMBER_REGEX)])),
        status: new FormControl('', Validators.compose([Validators.required]))

      }
    );

  }



  saveCatalystShapeData(catalystShape: any) {
    this.catalystShapeDto.isEnable = false;
    this.catalystShapeDto.isDisabled = true;

    this.catalystShape = new CatalystShape();
    this.catalystShapeDto.catalystShapeForm.reset();
    if (catalystShape.id) {
      catalystShape.status = this.commonService.getStatusToFind(catalystShape);
      this.catalystShapeService.update(catalystShape).subscribe(result => {
        this.catalystShapeDto.totalRecords =0;

        this.catalystShapeDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();


      },
        (error) => {
          this.catalystShapeDto.isDisabled = false;
          this.notify.showError(error.message);
          catalystShape.status = this.commonService.getStatus(catalystShape);
        });
    } else {
      catalystShape.status = this.commonService.getStatusToFind(catalystShape);
      this.catalystShapeService.save(catalystShape).subscribe(result => {
        this.catalystShapeDto.totalRecords =0;

        this.catalystShapeDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();


      }, (error) => {
        this.catalystShapeDto.isDisabled = false;
        this.notify.showError(error.message);
        catalystShape.status = this.commonService.getStatus(catalystShape);
      });
    }

  }

  getCatalystShapeList() {
    this.catalystShapeDto.loading = true;

    this.catalystShapeService.getAllCatalystShape().subscribe(result => {
      this.catalystShapeDto.loading = false;
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.catalystShapeDto.rows = result.data;


      this.catalystShapeDto.totalRecords = this.catalystShapeDto.rows.length;

    },
      (error) => {
        this.catalystShapeDto.loading = false;
        this.notify.showError(error.message);
      });
  }
  pagenationChange(evt: any) {
    this.catalystShapeDto.nOfRecordPage = evt.rows;
    this.catalystShapeDto.catalystShapeList = this.catalystShapeDto.rows
      .slice(evt.first, evt.first + this.catalystShapeDto.nOfRecordPage);
  }
  onResetClick() {
    this.catalystShapeDto.isEnable = false;
    this.catalystShapeDto.totalRecords =0;

    this.getCatalystShapeList();
    this.catalystShape = new CatalystShape();
    this.catalystShapeDto.catalystShapeForm.reset();
    this.catalystShapeDto.isErrorFraction = false;
    this.catalystShapeDto.isError = false;
  }
  onRoleEditClick(evt: any) {
    this.catalystShapeDto.isEnable = true;
    this.catalystShapeDto.isDisabled = false;
    this.catalystShape = new CatalystShape();
    this.catalystShapeService.getById(evt.id).subscribe(role => {
      this.catalystShape = role.data;
      this.catalystShape.status = this.commonService.getStatus(this.catalystShape);
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  onCatalystShapeDelete(data: number) {
    this.catalystShapeDto.skId = data;
    this.catalystShapeService.delete(data, this.catalystShapeDto.skId).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.catalystShape = new CatalystShape();
      this.catalystShapeDto.catalystShapeForm.reset();
      this.getCatalystShapeList();
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  find(catalystShape: any) {
    this.catalystShapeDto.catalystShapeList = 0;
    this.catalystShapeDto.totalRecords =0;

    if (catalystShape.status) {
      catalystShape.status = this.commonService.getStatusToFind(catalystShape);
    }
    if (this.catalystShapeDto.catalystShapeForm.valid || this.catalystShapeDto.catalystShapeForm.dirty) {
      this.catalystShapeDto.rows = [];
      this.catalystShapeDto.loading = true;
      this.catalystShapeService.findRole(catalystShape).subscribe(result => {
        this.catalystShapeDto.loading = false;
        if (result.body.data === false) {
          this.catalystShapeDto.rows = [];
        } else {
          this.catalystShapeDto.rows = result.body.data;
        }

        this.catalystShapeDto.rows.forEach(data => {
          data.status = this.commonService.getStatus(data);
        });

        if (catalystShape.status) {
          catalystShape.status = this.commonService.getStatus(catalystShape);
        }
        this.catalystShape = catalystShape;
        if (result.body.data.length === 0) {
          this.catalystShapeDto.catalystShapeList = result.body.data.length;
          this.catalystShapeDto.numberOfRecords = this.catalystShapeDto.catalystShapeList;

        } else {
          this.catalystShapeDto.catalystShapeList = result.body.data;
          this.catalystShapeDto.numberOfRecords = this.catalystShapeDto.catalystShapeList.length;

        }
        this.catalystShapeDto.totalRecords = result.body.data.length;
        this.notify.showSuccess(result.body.message);
      },
        (error) => {
          this.catalystShapeDto.loading = false;
          this.catalystShapeDto.catalystShapeList = null;
          this.catalystShapeDto.totalRecords = 0;
          this.notify.showError(error.message);
this.onResetClick();
          if (catalystShape.status) {
            catalystShape.status = this.commonService.getStatus(catalystShape);
          }
          this.catalystShape = catalystShape;
        });
    } else {
      this.catalystShapeDto.catalystShapeForm.reset();
      this.notify.showError('Enter at least one field to search');
    }
  }
  deleteConfirmation(catalystShape: any) {
    this.catalystShapeDto.idToDelete = catalystShape.id;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onCatalystShapeDelete(this.catalystShapeDto.idToDelete);
      }
    });
  }


}
