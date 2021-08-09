import { Component, OnInit, ViewChild } from '@angular/core';
import { LimsComponentModel, LimsDTO, StandardCompnentPop } from './lims.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { LimsService } from './lims.service';
import { LimsAnalysisMethodService } from '../lims-analysis-method/lims-analysis-method.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { AnalysisMethod } from '../lims-analysis-method/lims-analysis-method.model';
import { Table } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';

@Component({
  selector: 'app-lims',
  templateUrl: './lims.component.html'
})
export class LIMSComponent implements OnInit {
  limsDTO: LimsDTO = new LimsDTO();
  lims: LimsComponentModel = new LimsComponentModel();
  limsStandard: StandardCompnentPop = new StandardCompnentPop();
  analysisMethod: AnalysisMethod = new AnalysisMethod();
  @ViewChild('dataTable') table: Table;
  flag = true;
  constructor(private formBuilder: FormBuilder, private bsModalService: BsModalService,
    public limsService: LimsService, private notify: NotificationService,
    private limsAnalysisService: LimsAnalysisMethodService,
    private commonService: CommonService, private router: ActivatedRoute,
    private dashboardService: DashboadrdService) {
    this.limsDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.limsDTO.standardComponentObject.standardComponentPage = 1;
    this.limsDTO.standardComponentObject.standardComponentnOfRecordPage = 10;
    this.limsDTO.standardComponentObject.standardComponentnOfRecordPage = 10;
    this.limsDTO.standardComponentObject.sortOrder = 'ASC';
    this.limsDTO.standardComponentObject.sortColumn = 'COMP_TYPE_NM';
    this.limsDTO.nOfRecordPage = 10;
    this.limsDTO.limsnOfRecordPage = 10;
    this.limsDTO.standnOfRecordPage = 10;
    this.limsDTO.standardTotalRecords = 0;

    this.limsFromControls();

    this.limsOperationsFlyOutFormControl();
    this.standardFlyOutFormControl();
    this.getLimsList();
    this.getUOMGroup();
    this.limsDTO.limsList = true;
    this.limsDTO.columns = [
      { field: 'limsOperationName', header: ' LIMS Operation' },
      { field: 'limsComponent', header: 'LIMS Component' },
      { field: 'fdmsComponent', header: 'Standard Component' },

      { field: 'uomUnitName', header: 'UOM Name' },
      { field: 'precision', header: 'Precision' }
    ];
    if (this.limsDTO.privilege) {
      this.limsDTO.columns.push({ field: 'delete', header: 'Action' });
    }
  }

  getUOMGroup() {
    this.limsAnalysisService.getUomGroupList().subscribe(result => {
      this.limsDTO.uomGroupNameList = result.data;
    });
  }
  limsFromControls() {
    this.limsDTO.limsForm = this.formBuilder.group(
      {
        limsOperation: new FormControl('', Validators.compose([Validators.required])),
        limsComponent: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255),
        Validators.pattern(SPACE_REGEXP)])),
        standardComponent: new FormControl('', Validators.compose([Validators.required])),
        precision: new FormControl('', Validators.compose([Validators.required])),
        uomGroup: new FormControl('', Validators.compose([Validators.required])),
        uomName: new FormControl('', Validators.compose([Validators.required])),

      }
    );
  }
  limsOperationsFlyOutFormControl() {
    this.limsDTO.limsOperationsFlyOutForm = this.formBuilder.group({
      analysisType: new FormControl('', Validators.pattern(SPACE_REGEXP)),
      limsOperation: new FormControl('', Validators.pattern(SPACE_REGEXP))
    });
  }
  standardFlyOutFormControl() {
    this.limsDTO.standardFlyOutForm = this.formBuilder.group({
      componentType: new FormControl(''),
      componentName: new FormControl('')
    });
  }
  getLimsOperationFlyOutData1(lims) {
    this.limsService.loading = true;
    this.limsService.getLimsOperationFlyOutData(lims).subscribe(limsOperationFlyOutResult => {
      this.limsDTO.limsOperationsDataList = limsOperationFlyOutResult.body.data.limsOperations;
      this.limsDTO.limsTotalRecords = limsOperationFlyOutResult.body.data.recordsFetched;
      this.limsDTO.limsOperationColumns = [
        { field: 'analysisTypeName', header: ' Analysis Type' },
        { field: 'limsOperationName', header: 'LIMS Operation ' }
      ];

      this.limsService.loading = false;
    },
      (error) => {
        this.limsService.loading = false;
        this.limsDTO.limsOperationsDataList = null;
        this.limsDTO.limsTotalRecords = 0;
        this.notify.showError(error.message);
      });
  }

  getLimsOperationFlyOutData() {
    this.limsService.loading = true;
    this.limsService.getLimsOperationFlyOutData(this.lims).subscribe(limsOperationFlyOutResult => {
      this.limsDTO.limsOperationsDataList = limsOperationFlyOutResult.body.data.limsOperations;
      this.limsDTO.limsTotalRecords = limsOperationFlyOutResult.body.data.recordsFetched;
      this.limsDTO.limsOperationColumns = [
        { field: 'analysisTypeName', header: ' Analysis Type' },
        { field: 'limsOperationName', header: 'LIMS Operation ' }
      ];

      this.limsService.loading = false;
    },
      (error) => {
        this.limsService.loading = false;
        this.limsDTO.limsOperationsDataList = null;
        this.limsDTO.limsTotalRecords = 0;
        this.notify.showError(error.message);
      });
  }

  savelimsData(lims) {
    lims.precision = parseFloat(lims.precision);
    this.limsService.loading = true;

    this.limsService.save(lims).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.limsDTO.standardCompnentDataList = [];
      this.limsDTO.standardTotalRecords = 0;
      this.lims = new LimsComponentModel();
      this.getLimsList();
      this.limsDTO.limsForm.reset();
      this.limsService.loading = false;
    }, (error) => {
      this.limsService.loading = false;
      this.notify.showError(error.message);
    });

  }
  getLimsList() {

    this.limsService.loading = true;

    this.limsService.getAllLims(this.lims).subscribe(result => {
      this.limsDTO.limsList = result.body.data.limsAnalysisComponentList;
      this.limsDTO.totalRecords = result.body.data.recordsFetched;
      this.limsService.loading = false;
    },
      (error) => {
        this.limsService.loading = false;
        this.notify.showError(error.message);
      });

  }

  onResetClick() {
    this.limsDTO.analysisTypeName = '';
    this.limsDTO.totalRecords = 0;
    this.lims = new LimsComponentModel();
    this.getLimsList();
    this.limsDTO.limsForm.reset();
    this.limsDTO.uomNameList = [];
    this.limsDTO.uomGroupNameSelect = [];
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.limsDTO.standardCompnentDataList = [];
    this.limsDTO.standardTotalRecords = 0;
    this.lims.limsOperationName = '';
    this.lims.fdmsComponent = '';

  }
  onEditClick(evt: any) {
    this.lims = new LimsComponentModel();
    this.lims = evt;
    this.getGroupNameList(evt.uomGroupId);
    this.limsDTO.uomGroupNameSelect.forEach(val => {
      if (val.id === this.lims.uomUnitId) {
        val.id = this.lims.uomUnitId;
      }
    });

  }
  closeFlyout() {
    if ((this.lims.limsOperationName === undefined || this.lims.limsOperationName === null)) {
      this.limsDTO.limsOperationsFlyOutForm.reset();
      this.lims.limsOperationName = this.lims.limsOperationName;
    } else {
      this.lims.limsOperationName = this.lims.limsOperationName;

    }

  }
  onLimsDelete(data: any) {
    this.limsService.loading = true;
    this.limsService.delete(data).subscribe(result => {
      this.lims = new LimsComponentModel();
      this.getLimsList();
      this.limsDTO.limsForm.reset();
      this.limsService.loading = false;
      this.notify.showSuccess(result.body.message);
    },
      (error) => {
        this.limsService.loading = false;
        this.notify.showError(error.message);
      });
  }
  getStandardComponentFlyOutData(OperationName) {
    OperationName.currentPage = this.limsDTO.standardComponentObject.standardComponentPage;
    OperationName.recordsPerPage = this.limsDTO.standardComponentObject.standardComponentnOfRecordPage;
    OperationName.sortColumn = this.limsDTO.standardComponentObject.sortColumn;
    OperationName.sortOrder = this.limsDTO.standardComponentObject.sortOrder;
    this.limsDTO.standardComponentColumns = [
      { field: 'componentType', header: ' Component Type' },
      { field: 'componentLabel', header: ' Component Name' }
    ];
    this.limsService.loading = true;
    this.lims.componentType = OperationName.componentType;
    this.limsService.getStandardComponentFlyOutDetails(OperationName).subscribe(standardCompnentFlyOutResult => {
      this.limsDTO.standardCompnentDataList = standardCompnentFlyOutResult.body.data.components;
      this.limsDTO.standardTotalRecords = standardCompnentFlyOutResult.body.data.recordsFetched;
      this.limsService.loading = false;
    },
      (error) => {
        this.limsService.loading = false;
        this.notify.showError(error.message);
      });
  }
  find(lims: any) {
    if (lims.precision != null) {
      lims.precision = parseFloat(lims.precision);
    }
    this.limsDTO.totalRecords = 0;
    lims.currentPage = 1;
    lims.recordsPerPage = 10;
    this.limsService.loading = true;
    this.limsService.getAllLims(lims).subscribe(result => {
      this.limsDTO.limsList = result.body.data.limsAnalysisComponentList;
      this.limsDTO.totalRecords = result.body.data.recordsFetched;

      this.notify.showSuccess(result.body.message);
      this.limsService.loading = false;
    },
      (error) => {
        this.limsService.loading = false;
        this.limsDTO.limsList = null;
        this.limsDTO.totalRecords = 0;
        this.notify.showError(error.message);
      });

  }

  deleteConfirmation(lims: any) {
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onLimsDelete(lims);
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });
  }



  changePageEvent(evt: any) {
    this.limsDTO.nOfRecordPage = evt.rows;
    this.limsDTO.limsList = this.limsDTO.limsListRecord.slice(evt.first, evt.first + this.limsDTO.nOfRecordPage);
  }
  changePageEvent1(evt: any) {
    this.limsDTO.nOfRecordPage = evt.rows;
    this.limsDTO.limsOperationnOfRecordPage = this.limsDTO.limsOperationsDataList.slice(evt.first, evt.first + this.limsDTO.nOfRecordPage);
  }
  changePageEvent2(evt: any) {
    this.limsDTO.nOfRecordPage = evt.rows;
    this.limsDTO.standardComponentnOfRecordPage =
      this.limsDTO.standardCompnentDataList.slice(evt.first, evt.first + this.limsDTO.nOfRecordPage);
  }
  onClickLimsOperationFlyOut(data) {


    this.limsDTO.LimsOperationFlyOut = true;
    const lims = new LimsComponentModel();
    this.lims.limsOperationName = data.limsOperationName;
    this.getLimsOperationFlyOutData1(lims);
    this.limsDTO.limsOperationsFlyOutForm.reset();




  }
  standardComponentFlyout() {
    this.limsDTO.standardComponentFlyOut = true;
  }
  onlimsOperationsEditMainClick(limsOperationData: any) {
    this.limsDTO.operationNameForReset = limsOperationData;
    this.lims.limsOperationName = limsOperationData.limsOperationName;
    this.lims.analysisTypeName = limsOperationData.analysisTypeName;
    this.lims.limsComponent = limsOperationData.limsComponent;
    this.lims.fdmsComponent = limsOperationData.fdmsComponent;
    this.lims.uomGroupId = limsOperationData.uomGroupId;
    this.lims.uomUnitId = limsOperationData.uomUnitId;
    this.lims.precision = limsOperationData.precision;
    this.getStandardComponentFlyOutData(limsOperationData);
    this.getGroupNameOnOperations(limsOperationData);
    this.getGroupNameList(limsOperationData.uomGroupId);

  }
  onlimsOperationsEditClick(limsOperationData: any) {
    this.limsDTO.operationNameForReset = limsOperationData;
    this.lims.limsOperationName = limsOperationData.limsOperationName;
    this.lims.analysisTypeName = limsOperationData.analysisTypeName;
 // add-1
 this.limsDTO.analysisTypeName = limsOperationData.analysisTypeName;
    this.lims.uomGroupId = limsOperationData.uomGroupId;

    this.getStandardComponentFlyOutData(limsOperationData);
    this.getGroupNameOnOperations(limsOperationData);
    this.getGroupNameList(limsOperationData.uomGroupId);

    const operationFlyout = document.getElementById('flyoutModal1');
    operationFlyout.click();
  }

  getGroupNameList(id: any) {
    this.limsService.getGroupNameOnOperationsDetails(id).subscribe(result => {
      this.limsDTO.uomGroupNameSelect = result.data;
    });
  }
  onStandardEditClick(evt: any) {
    this.lims.fdmsComponent = evt.componentLabel;
    const StandardFlyoutModelClose = document.getElementById('standardComponentFlyOut');
    StandardFlyoutModelClose.click();
  }
  onlimsOperationsResetClick() {
    const paginationObject = {
      page: 0, first: 10, rows: 10
    };
    this.paginateOperationTable(paginationObject);
    this.limsDTO.limsOperationsFlyOutForm.reset();
    this.getLimsOperationFlyOutData();
  }
  onResetStandardClick() {
    this.limsDTO.standardComponentObject.standardComponentPage = 1;
    this.limsDTO.standardComponentObject.standardComponentnOfRecordPage = 10;
    this.limsDTO.standardComponentObject.sortColumn = 'COMP_TYPE_NM';
    this.limsDTO.standardComponentObject.sortOrder = 'ASC';
    this.limsDTO.standardFlyOutForm.reset();
    this.getStandardComponentFlyOutData(this.limsDTO.operationNameForReset);
  }

  getGroupNameOnOperations(OperationName) {
    OperationName.currentPage = 1;
    OperationName.recordsPerPage = 10;

    this.limsAnalysisService.getUomGroupList().subscribe(result => {
      this.limsDTO.uomGroupNameList = result.data;
      this.limsDTO.uomGroupNameList.forEach(val => {
        if (val.id === OperationName.uomGroupId) {
          this.lims.uomGroupId = val.id;
        }
      });
    });
  }

  onlimsOperationsfind(OperationsData) {
    // add loader
    OperationsData.currentPage = 1;
    OperationsData.recordsPerPage = 10;
    if (OperationsData.analysisTypeName || OperationsData.limsOperationName) {
      this.limsDTO.limsOperationColumns = [
        { field: 'analysisTypeName', header: ' Analysis Type' },
        { field: 'limsOperationName', header: 'LIMS Operation ' }
      ];
      this.limsService.loading = true;
      this.limsService.getLimsOperationFlyOutData(OperationsData).subscribe(limsOperationFlyOutResult => {
        if (limsOperationFlyOutResult.body.data.recordsFetched > 0) {
          this.limsDTO.limsOperationsDataList = limsOperationFlyOutResult.body.data.limsOperations;
          this.limsDTO.limsTotalRecords = this.limsDTO.limsOperationsDataList.length;
          this.notify.showSuccess(limsOperationFlyOutResult.body.message);
          this.limsService.loading = false;

        } else {

          this.notify.showError(limsOperationFlyOutResult.body.message);
          this.limsDTO.limsTotalRecords = 0;
        }
      },
        (error) => {
          this.notify.showError(error.message);
          this.limsService.loading = false;
          this.limsDTO.limsOperationsDataList = null;
          this.limsDTO.limsTotalRecords = 0;
        });
    } else {
      this.notify.showError('Enter at least one field to search');


    }
  }
  findStandard(lims) {
    lims.analysisTypeName = this.limsDTO.analysisTypeName;
    if (lims.componentType || lims.componentLabel) {
      this.limsService.loading = true;
      this.limsService.getStandardComponentFlyOutDetails(lims).subscribe(standardCompnentFlyOutResult => {
        this.limsDTO.standardCompnentDataList = standardCompnentFlyOutResult.body.data.components;
        this.limsDTO.standardTotalRecords = this.limsDTO.standardCompnentDataList.length;
        this.notify.showSuccess(standardCompnentFlyOutResult.body.message);
        this.limsService.loading = false;

        this.limsDTO.standardComponentColumns = [
          { field: 'componentType', header: ' Component Type' },
          { field: 'componentLabel', header: ' Component Name' }
        ];
      },
        (error) => {
          this.notify.showError(error.message);
        });
    } else {
      this.notify.showError('Enter at least one field to search');


    }
  }
  paginate(data) {
    this.lims.currentPage = data.page + 1;
    this.lims.recordsPerPage = data.rows;
    this.getLimsList();
  }

  customSort(sortObject: any) {
    this.flag = !this.flag;
    if (this.flag) {
      this.lims.sortOrder = 'ASC';
    } else {
      this.lims.sortOrder = 'DESC';
    }
    if (sortObject === 'componentLabel') {
      this.lims.sortColumn = 'COMPONENT_STANDARD_NM';
    } else if (sortObject === 'limsOperationName') {
      this.lims.sortColumn = 'LIMSOperationName';
    } else if (sortObject === 'limsComponent') {
      this.lims.sortColumn = 'LIMSComponent';
    } else if (sortObject === 'fdmsComponent') {
      this.lims.sortColumn = 'ADSDATComponent';
    } else {
      this.lims.sortColumn = sortObject;
    }
    this.getLimsList();
  }


  resetSort() {
    this.table.sortOrder = 0;
    this.table.sortField = '';
  }

  sortOPerationListTable(sortObject: any) {
    this.flag = !this.flag;
    if (this.flag) {
      this.lims.sortOrder = 'ASC';
    } else {
      this.lims.sortOrder = 'DESC';
    }
    if (sortObject === 'analysisTypeName') {
      this.lims.sortColumn = 'RETRANSMIT_CAT_NM';
    }
    if (sortObject === 'limsOperationName') {
      this.lims.sortColumn = 'LIMS_OPERATION_NM';
    }
    this.getLimsOperationFlyOutData();
  }
  paginateOperationTable(data) {
    this.lims = new LimsComponentModel();
    this.lims.currentPage = data.page + 1;
    this.lims.recordsPerPage = data.rows;
    this.lims.sortOrder = 'ASC';
    this.lims.sortColumn = 'RETRANSMIT_CAT_NM';
    this.getLimsOperationFlyOutData();
  }

  sortStandardFlyout(sortObject: any) {

    this.flag = !this.flag;
    if (this.flag) {
      this.limsDTO.standardComponentObject.sortOrder = 'ASC';
    } else {
      this.limsDTO.standardComponentObject.sortOrder = 'DESC';
    }
    if (sortObject === 'componentType') {
      this.limsDTO.standardComponentObject.sortColumn = 'COMP_TYPE_NM';
    }
    if (sortObject === 'componentLabel') {
      this.limsDTO.standardComponentObject.sortColumn = 'COMPONENT_STANDARD_NM';
    }

    this.getStandardComponentFlyOutData(this.limsDTO.operationNameForReset);
  }
  paginateStandardFlyout(data) {
    this.limsDTO.standardComponentObject.standardComponentPage = data.page + 1;
    this.limsDTO.standardComponentObject.standardComponentnOfRecordPage = data.rows;
    this.limsDTO.standardComponentObject.sortOrder = 'ASC';
    this.limsDTO.standardComponentObject.sortColumn = 'COMP_TYPE_NM';
    this.getStandardComponentFlyOutData(this.limsDTO.operationNameForReset);
  }
  preventNonNumericalInput(evt: any) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    const number = evt.target.value.split('.');
    if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    if (number.length > 1 && charCode === 46) {
      return false;
    }
  }
  resetStandardComponentForm() {
    this.limsDTO.standardFlyOutForm.reset();
  }
}
