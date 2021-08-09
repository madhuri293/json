import { Component, OnInit,  ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { BehaviorSubject } from 'rxjs';
import { LimsAnalysisMethodService } from './lims-analysis-method.service';
import { LimsAnalysisModel, LimsAnalysisDTO, AnalysisMethod, Sources } from './lims-analysis-method.model';
import { UnitOfMeasurementService } from '../../manage/unit-of-measurement/unit-of-measurement.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { CommonService } from '../../../shared/common-services/common.service';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { Table } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lims-analysis-method',
  templateUrl: './lims-analysis-method.component.html'
})
export class LimsAnalysisMethodComponent implements OnInit {
  limsAnalysis: LimsAnalysisModel = new LimsAnalysisModel();
  limsAnalysisDTO: LimsAnalysisDTO = new LimsAnalysisDTO();
  analysisMethod: AnalysisMethod = new AnalysisMethod();
  analysisMethodData: any;
  tempUomData: any = [];
  commonSourceArray: any = [];
  flag = true;
  @ViewChild('dataTable') table: Table;
  constructor(private measurementService: UnitOfMeasurementService, private bsModalService: BsModalService
    , private formBuilder: FormBuilder, private commonService: CommonService,
    public limsAnalysisService: LimsAnalysisMethodService, private router: ActivatedRoute,
    private notify: NotificationService, private dashboardService: DashboadrdService) {
    this.limsAnalysisDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.getUOMList();
    this.limsAnalysisDTO.columns = [

      { field: 'methodName', header: 'Method Name' },
      { field: 'methodNumber', header: 'Method Number' },
      { field: 'uomGroup', subfield: 'groupName', header: 'UOM Group' },
      { field: 'limsOperation', header: 'LIMS Operation' },
      { field: 'checkedSourcesNames', header: 'Source Name' },
      { field: 'methodDescription', header: 'Method Description' },

    ];
    if (this.limsAnalysisDTO.privilege) {
      this.limsAnalysisDTO.columns.push({ field: 'delete', header: 'Action' });
    }
    this.dashboardService.showTechnologyHeader = false;
    this.limsAnalysis.currentPage = 1;
    this.limsAnalysis.recordsPerPage = 10;
    this.limsAnalysisDTO.loading = true;
    this.limsAnalysisDTO.nOfRecordPage = 10;
    // this.limsAnalysisDTO.totalRecords = 10;
    //  this.limsAnalysis.sortOrder = 'ASC';
    //  this.limsAnalysis.sortColumn = 'methodName';
    this.limsAnalysisFormControls();
    this.getSourceNameList();
    this.getLIMSAnalysisMethodData1();
    this.table.reset();
  }

  getLIMSAnalysisMethodData() {
    this.limsAnalysisService.loading = true;
    this.limsAnalysisDTO.limsAnalysisList = [];
    this.limsAnalysisService.getLIMSAnalysisData(this.limsAnalysis).subscribe(result => {
      this.analysisMethodData = result.body.data;
      this.limsAnalysisDTO.totalRecords = this.analysisMethodData.recordsFetched;
      this.limsAnalysisDTO.nOfRecordPage = this.limsAnalysis.recordsPerPage;
      this.limsAnalysisDTO.limsAnalysisList = result.body.data.analysisMethod;
      this.limsAnalysisService.loading = false;
    }, error => {
      this.limsAnalysisService.loading = false;
    });
  }
  getLIMSAnalysisMethodData1() {
    this.limsAnalysisService.loading = true;
    this.limsAnalysisDTO.limsAnalysisList = [];
    this.limsAnalysisService.getLIMSAnalysisData(this.limsAnalysis).subscribe(result => {
      this.analysisMethodData = result.body.data;
      this.limsAnalysisDTO.totalRecords = this.analysisMethodData.recordsFetched;
      this.limsAnalysisDTO.nOfRecordPage = this.limsAnalysis.recordsPerPage;
      this.limsAnalysisDTO.limsAnalysisList = this.analysisMethodData.analysisMethod;
      this.limsAnalysisService.loading = false;
    }, error => {
      this.limsAnalysisService.loading = false;
    });
  }
  getSourceNameList() {
    this.limsAnalysisService.getSourceNameList().subscribe(result => {
      this.limsAnalysisDTO.sourceNameList = result.data;
      this.limsAnalysisDTO.sourceNameList.forEach(data => {
        data.value = data.id;
      });
    });
  }
  limsAnalysisFormControls() {
    this.limsAnalysisDTO.limsAnalysisForm = this.formBuilder.group(
      {
        methodName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100),
        Validators.pattern(SPACE_REGEXP)])),
        methodNumber: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255),
        Validators.pattern(SPACE_REGEXP)])),
        uomGroup: new FormControl('', Validators.compose([Validators.required])),
        limsOperation: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100),
        Validators.pattern(SPACE_REGEXP)
        ])),
        sourceName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
        description: new FormControl('', Validators.compose([Validators.maxLength(250)]))
      }
    );
  }

  savelimsAnalysisData(limsAnalysis) {
    if (limsAnalysis.id) {
      this.limsAnalysisService.loading = true;
      this.limsAnalysisService.update(limsAnalysis).subscribe(result => {
        this.limsAnalysis = new LimsAnalysisModel();
        this.limsAnalysis.currentPage = 1;
        this.limsAnalysis.recordsPerPage = 10;
        this.limsAnalysisService.loading = false;
        this.notify.showSuccess(result.body.message);
        this.reset();
      },
        (error) => {
          this.limsAnalysisService.loading = false;
          this.notify.showError(error.message);
        });
    } else {
      this.limsAnalysisService.loading = true;
      this.limsAnalysisService.save(limsAnalysis).subscribe(result => {
        this.limsAnalysis = new LimsAnalysisModel();
        this.limsAnalysis.currentPage = 1;
        this.limsAnalysis.recordsPerPage = 10;
        this.limsAnalysisService.loading = false;
        this.notify.showSuccess(result.body.message);

        this.reset();
      }, (error) => {
        this.limsAnalysisService.loading = false;

        this.notify.showError(error.message);
      });
    }

  }
  getUomGroupName() {
    this.limsAnalysisService.getUomGroupList().subscribe(result => {
      this.limsAnalysisDTO.uomGroupNameList = result.data;

    });
  }


  onResetClick() {
    this.limsAnalysisDTO.totalRecords = 0;
    this.limsAnalysis = new LimsAnalysisModel();
    this.analysisMethod = new AnalysisMethod();
    this.limsAnalysisDTO.limsAnalysisForm.reset();
    this.limsAnalysisDTO.errorMessage = '';
    this.commonSourceArray = [];
    this.limsAnalysis.currentPage = 1;
    this.limsAnalysis.recordsPerPage = 10;
    this.limsAnalysisDTO.nOfRecordPage = 10;
    this.getLIMSAnalysisMethodData();

  }
  onLimsEdit(evt: any) {
    
    this.limsAnalysisDTO.disableSave = true;
    const idArray = [];
    this.limsAnalysis = new LimsAnalysisModel();
    this.limsAnalysis = JSON.parse(JSON.stringify(evt));
    evt.checkedSources.forEach(val => {
      idArray.push(val.id);
    });
    this.limsAnalysisDTO.SourceId = idArray;
    this.commonSourceArray = [];

  }

  onLimsAnalysisDelete(data: any) {
    this.limsAnalysisService.delete(data).subscribe(result => {
       this.limsAnalysis = new LimsAnalysisModel();
      this.limsAnalysisDTO.limsAnalysisForm.reset();
      this.getLIMSAnalysisMethodData();
      this.notify.showSuccess(result.body.message);
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  find(limsAnalysis: any) {
    this.limsAnalysisDTO.totalRecords = 0;
    this.limsAnalysisDTO.rows = [];
    if (limsAnalysis.sources) {
      limsAnalysis.sourceName = [];
      this.limsAnalysisDTO.sourceNameList.forEach(data => {
        limsAnalysis.sources.forEach(element => {
          if (element === data.id) {
            limsAnalysis.sourceName.push(data.commonSourceName);
          }
        });
      });
      limsAnalysis.sourceName = limsAnalysis.sourceName[0];
      delete limsAnalysis.sources;
      this.limsAnalysisService.loading = true;
    }
    limsAnalysis.currentPage = 1;
    limsAnalysis.recordsPerPage = 10;
    this.limsAnalysisService.loading = true;
    this.limsAnalysisService.find(limsAnalysis).subscribe(result => {

      this.analysisMethodData = result.body.data;
      this.limsAnalysisDTO.totalRecords = this.analysisMethodData.recordsFetched;
      this.limsAnalysisDTO.nOfRecordPage = this.limsAnalysis.recordsPerPage;
      this.analysisMethodData.analysisMethod.forEach(uomdat => {
        this.limsAnalysisDTO.uomGroupNameList.forEach(hugedata => {
          if (hugedata.id === uomdat.uomGroup.id) {
            uomdat.groupName = hugedata.groupName;
          }
        });
      });
      this.limsAnalysisDTO.limsAnalysisList = this.analysisMethodData.analysisMethod;
      this.notify.showSuccess(result.body.message);
      this.limsAnalysisService.loading = false;
    }, (error) => {
      this.limsAnalysisService.loading = false;
      this.limsAnalysisDTO.limsAnalysisList = null;
      this.limsAnalysisDTO.totalRecords = 0;
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
        this.onLimsAnalysisDelete(lims);
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });
  }

  changePageEvent(evt: any) {
    this.limsAnalysisDTO.nOfRecordPage = evt.rows;
    this.limsAnalysisDTO.limsAnalysisList = this.limsAnalysisDTO.rows.slice(evt.first, evt.first + this.limsAnalysisDTO.nOfRecordPage);
  }

  reset() {
    const paginationObject = {
      page: 0, first: 10, rows: 10
    };
    this.paginate(paginationObject);
    this.limsAnalysis = new LimsAnalysisModel();
    this.limsAnalysis.currentPage = 1;
    this.limsAnalysis.recordsPerPage = 10;
    this.limsAnalysisDTO.nOfRecordPage = 10;
    this.limsAnalysisDTO.limsAnalysisForm.reset();
    this.getLIMSAnalysisMethodData();
    this.table.sortOrder = 0;
    this.table.sortField = '';

  }

  onSourceSelect(lims: any) {
    this.limsAnalysisDTO.errorMessage = '';
    this.commonSourceArray = [];
    this.limsAnalysisDTO.sourceNameList.forEach((res) => {
      lims.forEach((data) => {
        if (res.id === data) {
          if (!this.commonSourceArray.includes(res.commonSourceName)) {
            this.commonSourceArray.push(res.commonSourceName);

          } 

        }
      });

    });
    const allEqual = arr => arr.every(v => v === arr[0]);
    const result = allEqual(this.commonSourceArray);
    this.limsAnalysis.checkedSources = [];
    if (result) {
      this.limsAnalysisDTO.disableSave = true;
      this.limsAnalysisDTO.sourceNameList.forEach((res) => {
        lims.forEach((data) => {
          const obj = new Sources();
          if (res.id === data) {
            obj.name = res.name;
            obj.id = res.id;
            obj.isUsed = true;
            this.limsAnalysis.checkedSources.push(obj);
          }
        });

      });
    } else {
      this.limsAnalysisDTO.errorMessage = 'Source category Mismatch';
      this.limsAnalysisDTO.disableSave = false;
      this.commonSourceArray = [];
    }

  }
  paginate(data) {
    this.limsAnalysis = new LimsAnalysisModel();
    this.limsAnalysis.currentPage = data.page + 1;
    this.limsAnalysis.recordsPerPage = data.rows;
    // this.limsAnalysis.sortOrder = 'ASC';
    // this.limsAnalysis.sortColumn = 'ANALYSIS_METHOD_NM';
    this.getLIMSAnalysisMethodData1();
  }
  customSort(sortObject: any) {
    // this.limsAnalysis = new LimsAnalysisModel();
    this.flag = !this.flag;
    if (this.flag) {
      this.limsAnalysis.sortOrder = 'ASC';
    } else {
      this.limsAnalysis.sortOrder = 'DESC';
    }

    if (sortObject === 'methodName') {
      this.limsAnalysis.sortColumn = 'ANALYSIS_METHOD_NM';
    }
    if (sortObject === 'methodDescription') {
      this.limsAnalysis.sortColumn = 'ANALYSIS_METHOD_DESC';
    }
    if (sortObject === 'limsOperation') {
      this.limsAnalysis.sortColumn = 'LIMS_OPERATION_NM';
    }
    if (sortObject === 'checkedSourcesNames') {
      this.limsAnalysis.sortColumn = 'ANALYSIS_SOURCE_NM';
    }
    if (sortObject === 'methodNumber') {
      this.limsAnalysis.sortColumn = 'ANALYSIS_METHOD_NUM';
    }
    this.getLIMSAnalysisMethodData1();
  }

  getUOMList() {
    this.limsAnalysisService.getUomGroupList().subscribe(uomListdata => {
      this.limsAnalysisDTO.uomGroupNameList = uomListdata.data;
    });
  }
  resetSort() {
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
  }
  methodNameInput(limsAnalysis: any) {

    this.limsAnalysisService.getAllByMethodName(limsAnalysis.methodName).subscribe(result => {
      if (result.body.data.recordsFetched > 0) {
        const idArrayList = [];
        this.limsAnalysis = result.body.data.analysisMethod[0];
        delete this.limsAnalysis.id;
        this.limsAnalysis.limsOperation = limsAnalysis.limsOperation;
        this.limsAnalysis.checkedSources.forEach(val => {
          idArrayList.push(val.id);
        });
        this.limsAnalysisDTO.SourceId = idArrayList;
        this.commonSourceArray = [];
        this.limsAnalysisDTO.disableSave = true;
      } else {


        this.limsAnalysis = limsAnalysis;


      }

    },
      (error) => {
        this.limsAnalysisDTO.loading = false;
        this.notify.showError(error.message);
      });
  }
}

