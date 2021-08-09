import { Component, OnInit } from '@angular/core';
import { Diluent, DiluentDTO } from './diluent.model';
import { DiluentService } from './diluent.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { SPACE_REGEXP, DESC_SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { StatusEnum, DeleteMessageEnum, ValueType } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-diluent',
  templateUrl: './diluent.component.html'
})
export class DiluentComponent implements OnInit {
  diluent: Diluent = new Diluent();
  diluentDTO: DiluentDTO = new DiluentDTO();

  // tslint:disable-next-line:max-line-length
  constructor(private commonService: CommonService, private notify: NotificationService, private formBuilder: FormBuilder, public diluentService: DiluentService,
    private bsModalService: BsModalService, private router: ActivatedRoute) {
    this.diluentDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.diluentDTO.loading = true;

    this.diluentFormControls();
    this.diluentDTO.nOfRecordPage = 10;
    this.getSizeList();
    this.getStatus();
    this.getDiluentIndicator();
  }
  units(data: any) {
    if (data.length > 0) {
      this.getdiluentList();

    }
  }
  getStatus() {
    this.diluentDTO.statusList = this.commonService.getStatusList();
  }
  getDiluentIndicator() {
    this.diluentDTO.indicatorList = this.commonService.getDiluentStatusList();
  }
  diluentFormControls() {
    this.diluentDTO.diluentForm = this.formBuilder.group({
      diluentName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255),
      Validators.pattern(SPACE_REGEXP)])),
      diluentSourceName: new FormControl('', Validators.compose([Validators.required,
      Validators.maxLength(30), Validators.pattern(SPACE_REGEXP)])),
      catalystSize: new FormControl('', Validators.compose([Validators.required])),
      referenceDulientInd: new FormControl('', Validators.compose([Validators.required])),
      status: new FormControl('', Validators.compose([Validators.required])),
      diluentDescription: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255),
      Validators.pattern(DESC_SPACE_REGEXP)]))
    });
  }
  saveDiluent(diluent: any) {
    if (diluent.id) {
      diluent.status = this.commonService.getStatusToFindTemp(diluent);

      diluent.diluentInd = this.commonService.getReferenceTemp(diluent);
      this.diluentService.update(diluent).subscribe(result => {
        this.diluentDTO.totalRecords = 0;
        this.notify.showSuccess(result.body.message);
        this.getdiluentList();
        this.getSizeList();
        this.diluent = new Diluent();
        this.diluentDTO.diluentForm.reset();
      },
        (error) => {

          this.notify.showError(error.message);
        });
    } else {
      diluent.status = this.commonService.getStatusToFindTemp(diluent);

      diluent.diluentInd = this.commonService.getReferenceTemp(diluent);

      this.diluent.diluentSizeId = diluent.diluentSizeId;
      this.diluentService.save(diluent).subscribe(result => {
        this.diluentDTO.totalRecords = 0;
        this.notify.showSuccess(result.body.message);
        this.getdiluentList();
        this.diluent = new Diluent();
        this.diluentDTO.diluentForm.reset();
      }, (error) => {

        this.notify.showError(error.message);
      });
    }
  }
  find(diluent: any) {
    this.diluentDTO.totalRecords = 0;
    if (diluent.status === StatusEnum.ACTIVE) {
      diluent.status = StatusEnum.Y;
    } else {
      if (diluent.status !== undefined) {
        diluent.status = StatusEnum.N;
      }
    }
    if (diluent.diluentInd === StatusEnum.YES) {
      diluent.diluentInd = StatusEnum.Y;
    } else {
      if (diluent.diluentInd !== undefined) {
        diluent.diluentInd = StatusEnum.N;
      }
    }

    this.diluentDTO.loading = true;
    this.diluentService.find(diluent).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.commonService.sendToggleFlagFind(true);

      result.body.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
        data.diluentInd = this.commonService.getReferenceToFindTemp(data);
        this.diluentDTO.diluentList = result.body.data;
        this.diluentDTO.cols = [
          { field: 'diluentName', subfield: '', header: 'Designation' },
          { field: 'sourceName', subfield: '', header: 'Source' },
          { field: 'sizeCode', subfield: '', header: 'Size' },
          { field: 'diluentInd', subfield: '', header: 'Reference' },
          { field: 'status', subfield: '', header: 'Status' },
          { field: '', subfield: '', header: 'Action' },
        ];
        this.diluentDTO.totalRecords = this.diluentDTO.diluentList.length;
        this.diluentDTO.diluentDetail = this.diluentDTO.diluentList.slice(0, this.diluentDTO.nOfRecordPage);
      });

      if (diluent.status) {
        diluent.statusTemp = this.commonService.getStatus(diluent);

      }
      if (diluent.diluentInd) {
        diluent.diluentInd = this.commonService.getReferenceToFindTemp(diluent);

      }

      this.diluentDTO.loading = false;
    },
      (error) => {
        this.diluentDTO.loading = false;
        this.diluentDTO.diluentList = null;
        this.diluentDTO.totalRecords = 0;
        this.notify.showError(error.message);
        if (diluent.status) {
          diluent.statusTemp = this.commonService.getStatus(diluent);

        }
        if (diluent.referenceDulientInd) {
          diluent.referenceDulientInd = this.commonService.getReferenceToFindTemp(diluent);

        }

      });

  }

  getdiluentList() {
    this.diluentDTO.loading = true;

    this.diluentService.getdiluent().subscribe(result => {
      this.diluentDTO.loading = false;
      result.data.forEach(data => {
        data.diluentInd = this.commonService.getReferenceToFindTemp(data);

      });
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
        data.statusTemp = data.status;

      });
      this.diluentDTO.diluentList = result.data;
      this.diluentDTO.cols = [
        { field: 'diluentName', subfield: '', header: 'Designation' },
        { field: 'sourceName', subfield: '', header: 'Source' },
        { field: 'diluentSizeName', subfield: '', header: 'Size' },
        { field: 'diluentInd', subfield: '', header: 'Reference' },
        { field: 'statusTemp', subfield: '', header: 'Status' },
        { field: '', subfield: '', header: 'Action' },
      ];
      this.diluentDTO.totalRecords = this.diluentDTO.diluentList.length;
    },
      (error) => {
        this.diluentDTO.loading = false;
        this.notify.showError(error.message);
      });
  }
  getSizeList() {
    this.diluentService.getAllCatalystSize().subscribe(sizeDataResult => {
      this.diluentDTO.sizeDataList = sizeDataResult.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  deleteConfirmation(userdata: any) {
    this.diluentDTO.idToDelete = userdata.id;
    const sk = userdata.id;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.diluentService.delte(this.diluentDTO.idToDelete, sk).subscribe(res => {
          this.getdiluentList();
          this.notify.showSuccess(res.body.message);
          this.diluentDTO.diluentForm.reset();
          this.diluent = new Diluent();
          this.diluent.pdvf = NaN;
          this.diluent.abdvf = NaN;
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
    });
  }

  reset() {

    this.diluentDTO.totalRecords = 0;
    this.diluentDTO.diluentForm.reset();
    this.getSizeList(); 
    this.getStatus();
    this.getDiluentIndicator();
    this.diluentDTO.uomFlag = false;
    this.diluent = new Diluent();
    this.diluent.pdvf = NaN;
    this.diluent.abdvf = NaN;
    this.commonService.sendToggleFlag(true);

  }
  onEditClick(data: any) {
    this.diluent.id = data.id;
    this.diluentDTO.formValid = true;
    this.diluentService.getdiluentRecord(this.diluent.id).subscribe(Result => {
      this.diluent = Result.data;
      Result.data.status = this.commonService.getStatus(Result.data);

      if (Result.data.diluentInd === StatusEnum.Y) {
        Result.data.diluentInd = StatusEnum.YES;
      } else {
        Result.data.diluentInd = StatusEnum.NO;
      }

      this.diluentService.getAllCatalystSize().subscribe(result => {
        result.data.forEach(SizeData => {
          if (SizeData.id === this.diluent.diluentSizeId && SizeData.status === StatusEnum.N) {
            this.diluentDTO.sizeDataList.push(SizeData);
          }
        });
      });
      this.diluentDTO.uomFlag = true;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  catalystDiluentValue(value: any, type: any) {
    this.diluentDTO.uomFlag = true;
    if (type === ValueType.TYPE1) {
      this.diluent.pdvf = value;
    } else if (type === ValueType.TYPE2) {
      this.diluent.abdvf = value;

    }
    if (this.diluent.pdvf !== undefined && this.diluent.abdvf !== undefined) {
      this.diluentDTO.formValid = true;
    }
  }
}
