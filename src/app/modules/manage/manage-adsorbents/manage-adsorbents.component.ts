import { Component, OnInit } from '@angular/core';
import { ManageAdsorbents, ManageAdsorbentDTO, ProductName } from './manage-adsorbents.model';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { ManageAdsorbentsService } from './manage-adsorbents.service';
import { SPACE_REGEXP} from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { BsModalService } from 'ngx-bootstrap';
import { DeleteMessageEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-manage-adsorbents',
  templateUrl: './manage-adsorbents.component.html'
})
export class ManageAdsorbentsComponent implements OnInit {
  manageAdsorbent: ManageAdsorbents = new ManageAdsorbents();
  productName: ProductName = new ProductName();
  manageAdsorbentDTO: ManageAdsorbentDTO = new ManageAdsorbentDTO();



  // tslint:disable-next-line:max-line-length
  constructor(private commonService: CommonService,
    private bsModalService: BsModalService,
    public adsorbentService: ManageAdsorbentsService,
    private formBuilder: FormBuilder,
    private notify: NotificationService,
    private dashboardService: DashboadrdService,
    private router: ActivatedRoute) {
    this.manageAdsorbentDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.getTechnologies();
    this.dashboardService.showTechnologyHeader = true;
    this.adsorbentService.loading = true;

    this.manageAdsorbentDTO.uomInput = false;
    this.manageAdsorbentDTO.uomDirty = false;
    this.manageAdsorbentDTO.uopNoteLotFlg = false;
    this.manageAdsorbentDTO.nOfRecordPage = 10;
    this.manageAdsorbentDTO.nOfFlyRecordPage = 10;
    this.manageAdsorbentDTO.flyTotalRecords = 10;
    this.AdsorbentFromControls();
    this.AdsorbentFlyoutFromControls();
    // get local stored technology
    this.manageAdsorbent.technologyId = localStorage.getItem('technology');
    this.getProductTypeDropDown();
    this.getSampleTypeDropDown();
    this.getbinderTypeDropDown();
    this.getSizeTypeDropDown();
    this.getShapeTypeDropDown();
    this.getHfrDropDown();
    this.gethFrDropDown();
    this.gethfRDropDown();
    this.getConditionDropDown();
    this.absorbentGridData();

    this.manageAdsorbentDTO.columns = [
      { field: 'productName', header: 'Product Name' },
      { field: 'uop', header: 'UOP #' },
      { field: 'book', header: 'Notebook #' },
      { field: 'lot', header: 'Lot #' },
      { field: 'sampleTypeName', header: 'Sample Type' },
      { field: 'binderTypeName', header: 'Binder Type' },
      { field: 'sizeId', header: 'Normal Size' },
      { field: 'shapeId', header: 'Shape' },
      { field: 'hzrdNum', header: 'H' },
      { field: 'flameNum', header: 'F' },
      { field: 'reactNum', header: 'R' },
      { field: 'conditionName', header: 'Adsorbent Condition' }
    ];
    if (this.manageAdsorbentDTO.privilege) {
      this.manageAdsorbentDTO.columns.push({ field: 'action', header: 'Action' });
    }


    this.manageAdsorbentDTO.cols = [
      { field: 'productName', header: 'Product Name' },
      { field: 'productTypeName', header: 'Product Type ' },
      { field: 'productSubTypeName', header: 'Product Sub Type' }
    ];

    this.refresh();

  }
  units(data: any) {
    if (data.length > 0) {
      this.absorbentGridData();

    }
  }
  AdsorbentFromControls() {
    this.manageAdsorbentDTO.manageAdsorbentForm = this.formBuilder.group(
      {
        productName: new FormControl('', Validators.compose([Validators.maxLength(255),
        Validators.pattern(SPACE_REGEXP)])),
        productType: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(500),
        Validators.pattern(SPACE_REGEXP)])),
        bulkDensity: new FormControl(''),
        technology: new FormControl(''),
        productSubType: new FormControl('', Validators.compose([Validators.required])),

        productUop: new FormControl('', Validators.compose([Validators.maxLength(25), Validators.pattern(SPACE_REGEXP)])),
        notePart1: new FormControl('', Validators.compose([Validators.maxLength(10), Validators.pattern(SPACE_REGEXP)])),
        notePart2: new FormControl('', Validators.compose([Validators.maxLength(4), Validators.pattern(SPACE_REGEXP)])),
        notePart3: new FormControl('', Validators.compose([Validators.maxLength(2), Validators.pattern(SPACE_REGEXP)])),
        productLot: new FormControl('', Validators.compose([Validators.maxLength(100), Validators.pattern(SPACE_REGEXP)])),
        sampleDescription: new FormControl('', Validators.compose([Validators.maxLength(100), Validators.pattern(SPACE_REGEXP)])),
        sampleType: new FormControl('', Validators.compose([Validators.required])),
        binderType: new FormControl(''),
        normalSize: new FormControl('', Validators.compose([Validators.required])),
        shape: new FormControl(''),
        comments: new FormControl('', Validators.compose([Validators.maxLength(500)])),
        productH: new FormControl('', Validators.compose([Validators.required])),
        productF: new FormControl('', Validators.compose([Validators.required])),
        productR: new FormControl('', Validators.compose([Validators.required])),
        adsorbentCondition: new FormControl('', Validators.compose([Validators.required])),
        meanParticleDiameter: new FormControl(''),
        position: new FormControl('', Validators.compose([Validators.maxLength(100)])),
        productColor: new FormControl('', Validators.compose([Validators.maxLength(100)])),
        limsSampleId: new FormControl('', Validators.compose([Validators.required]))
      }
    );

  }
  getTechnologies() {
    const selectedTechnology = localStorage.getItem('technology');
    this.manageAdsorbent.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.manageAdsorbentDTO.technology = result.data;
      this.manageAdsorbentDTO.technology = this.manageAdsorbentDTO.technology.filter(val => val.status === StatusEnum.Y);
      this.manageAdsorbentDTO.technology = this.manageAdsorbentDTO.technology.filter(tech => tech.technologyId === selectedTechnology);

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  modeBulk(data: any) {

    this.manageAdsorbent.bulkDensityUOMId = data.id;
    this.manageAdsorbent.bulkDensity = data.baseValue;
    this.manageAdsorbentDTO.uomInput = true;
    this.manageAdsorbentDTO.uomDirty = true;
    // tslint:disable-next-line:max-line-length
    ((this.manageAdsorbent.meanPracticalDiameter === undefined) ? this.manageAdsorbentDTO.uomInput = false : this.manageAdsorbentDTO.uomInput = true);
  }
  modeMean(data: any) {
    this.manageAdsorbent.meanPracticalDiameterUOMId = data.id;
    this.manageAdsorbent.meanPracticalDiameter = data.baseValue;
    this.manageAdsorbentDTO.uomInput = true;
    this.manageAdsorbentDTO.uomDirty = true;
    ((this.manageAdsorbent.bulkDensity === undefined) ? this.manageAdsorbentDTO.uomInput = false : this.manageAdsorbentDTO.uomInput = true);
  }
  absorbentGridData() {
    this.adsorbentService.loading = true;
    this.adsorbentService.getAllAbsorbent().subscribe(result => {

      this.manageAdsorbentDTO.rows = result.data;
      this.manageAdsorbentDTO.totalRecords = this.manageAdsorbentDTO.rows.length;
      this.adsorbentService.loading = false;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.notify.showError(error.message);
      });
  }
  onDelete(data: any) {


    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onAdsorbentDelete(data);
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });
  }
  onAdsorbentDelete(data: any) {
    this.adsorbentService.delete(data.id, data.sk).subscribe(result => {
      this.manageAdsorbent = new ManageAdsorbents();
      this.manageAdsorbentDTO.manageAdsorbentForm.reset();
      this.notify.showSuccess(result.body.message);
      this.absorbentGridData();
      this.getTechnologies();
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  uopLotNoteAdd(data: any) {
    data.notePart1 = ((data.notePart1 === undefined || data.notePart1 === null) ? '' : data.notePart1);
    data.notePart2 = ((data.notePart2 === undefined || data.notePart2 === null) ? '' : data.notePart2);
    data.notePart3 = ((data.notePart3 === undefined || data.notePart3 === null) ? '' : data.notePart3);
    if ((data.notePart1 !== null) || (data.notePart2 !== null)
      || (data.notePart3 !== null)) {
      this.manageAdsorbent.book = data.notePart1 + '-' + data.notePart2 + '-' + data.notePart3;

    }
    if ((data.lot !== null && data.Lot !== undefined) ||
      (data.uop !== null && data.uop !== undefined) ||
      (this.manageAdsorbent.book !== null && this.manageAdsorbent.book !== undefined)) {
      this.manageAdsorbentDTO.uopNoteLotFlg = true;
    }

  }
  AdsorbentFlyoutFromControls() {
    this.manageAdsorbentDTO.adsorbentForm = this.formBuilder.group(
      {
        productName: new FormControl('')

      }
    );

  }
  getProductTypeDropDown() {
    this.adsorbentService.loading = true;
    this.adsorbentService.getProductTypeDropDown().subscribe(result => {
      this.manageAdsorbentDTO.typeList = result.data;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.notify.showError(error.message);
      });
  }
  changeProductType(productTypeId: any) {
    this.getProductSubTypeDropDown(productTypeId);

  }
  getProductSubTypeDropDown(productTypeId: any) {
    this.adsorbentService.getProductSubTypeDropDown(productTypeId).subscribe(result => {
      this.manageAdsorbentDTO.subTypeList = result.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  getSampleTypeDropDown() {
    this.adsorbentService.loading = true;
    this.adsorbentService.getSampleTypeDropDown().subscribe(result => {
      this.manageAdsorbentDTO.sampleTypeList = result.data;
      this.adsorbentService.loading = false;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.notify.showError(error.message);
      });
  }
  getbinderTypeDropDown() {
    this.adsorbentService.loading = true;
    this.adsorbentService.getbinderTypeDropDown().subscribe(result => {
      this.manageAdsorbentDTO.binderTypeList = result.data;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.notify.showError(error.message);
      });
  }
  getSizeTypeDropDown() {
    this.adsorbentService.loading = true;
    this.adsorbentService.getSizeTypeDropDown().subscribe(result => {
      this.manageAdsorbentDTO.sizeTypeList = result.data;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.notify.showError(error.message);
      });
  }
  getShapeTypeDropDown() {
    this.adsorbentService.loading = true;
    this.adsorbentService.getShapeTypeDropDown().subscribe(result => {
      this.manageAdsorbentDTO.shapeTypeList = result.data;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.notify.showError(error.message);
      });
  }
  getHfrDropDown() {
    this.adsorbentService.loading = true;
    this.adsorbentService.getHfrDropDown().subscribe(result => {
      this.manageAdsorbentDTO.hTypeList = result.data;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.notify.showError(error.message);
      });
  }
  gethFrDropDown() {
    this.adsorbentService.loading = true;
    this.adsorbentService.gethFrDropDown().subscribe(result => {
      this.manageAdsorbentDTO.fTypeList = result.data;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.notify.showError(error.message);
      });
  }
  gethfRDropDown() {
    this.adsorbentService.loading = true;
    this.adsorbentService.gethfRDropDown().subscribe(result => {
      this.manageAdsorbentDTO.rTypeList = result.data;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.notify.showError(error.message);
      });
  }
  getConditionDropDown() {
    this.adsorbentService.loading = true;
    this.adsorbentService.getConditionDropDown().subscribe(result => {
      this.manageAdsorbentDTO.conditionTypeList = result.data;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.notify.showError(error.message);
      });
  }
  savemanageAdsorbentData(manageAdsorbent: any) {
    this.manageAdsorbentDTO.isDisabled = true;

    // tslint:disable-next-line:no-non-null-assertion

    if (manageAdsorbent.id) {
      // tslint:disable-next-line:no-non-null-assertion
      if (manageAdsorbent.limsSampleId !== undefined && manageAdsorbent.limsSampleId !== null
        && manageAdsorbent.limsSampleId.length !== 0) {
        manageAdsorbent.limsSampleId = manageAdsorbent.limsSampleId.toString();
      }
      if (manageAdsorbent.limsSampleId !== undefined && manageAdsorbent.limsSampleId !== null) {
        manageAdsorbent.limsSampleId = manageAdsorbent.limsSampleId.toString();
      }
      this.adsorbentService.update(manageAdsorbent).subscribe(result => {
        this.manageAdsorbentDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.manageAdsorbentDTO.manageAdsorbentForm.reset();
        this.manageAdsorbent = new ManageAdsorbents();
        this.productName = new ProductName();
        this.getTechnologies();
        this.absorbentGridData();
      },
        (error) => {
          this.manageAdsorbentDTO.isDisabled = false;
          this.notify.showError(error.message);

        });
    } else {
      // tslint:disable-next-line:no-non-null-assertion
      if (manageAdsorbent.limsSampleId !== undefined && manageAdsorbent.limsSampleId !== null) {
        manageAdsorbent.limsSampleId = manageAdsorbent.limsSampleId.toString();
      }
      this.adsorbentService.save(manageAdsorbent).subscribe(result => {
        this.manageAdsorbentDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.manageAdsorbent = new ManageAdsorbents();
        this.manageAdsorbentDTO.manageAdsorbentForm.reset();
        this.productName = new ProductName();
        this.absorbentGridData();
        this.getTechnologies();
      }, (error) => {
        this.manageAdsorbentDTO.isDisabled = false;
        this.notify.showError(error.message);

      });
    }

  }
  getmanageAdsorbentList() {
    this.manageAdsorbentDTO.loading = true;
    this.adsorbentService.getAllmanageAdsorbent().subscribe(result => {
      this.manageAdsorbentDTO.loading = false;
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);

      });
      this.manageAdsorbentDTO.manageAdsorbentList = this.manageAdsorbentDTO.rows.slice(0, this.manageAdsorbentDTO.nOfRecordPage);
      this.manageAdsorbentDTO.totalRecords = this.manageAdsorbentDTO.rows.length;
      this.manageAdsorbentDTO.numberOfRecords = this.manageAdsorbentDTO.rows.length;
    },
      (error) => {
        this.manageAdsorbentDTO.loading = false;
        this.notify.showError(error.message);
      });
  }
  onResetClick() {
    this.manageAdsorbentDTO.subTypeList = null;
    this.productName = new ProductName();
    this.manageAdsorbentDTO.uomDirty = false;
    this.manageAdsorbentDTO.uopNoteLotFlg = false;
    this.manageAdsorbent = new ManageAdsorbents();
    this.manageAdsorbentDTO.manageAdsorbentForm.reset();
    this.manageAdsorbentDTO.adsorbentForm.reset();

    this.getTechnologies();
    this.absorbentGridData();
    this.commonService.sendToggleFlag(true);


  }
  resetFlyout() {
    this.productName = new ProductName();
    this.manageAdsorbent.productName = '';

    this.manageAdsorbentDTO.adsorbentForm.reset();
    this.getProductData();



  }
  getmanageAdsorbentFlyoutList() {
    this.manageAdsorbentDTO.loading = true;
    this.adsorbentService.getAllmanageAdsorbent().subscribe(result => {
      this.manageAdsorbentDTO.loading = false;
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);


      });
      this.manageAdsorbentDTO.manageAdsorbentList = this.manageAdsorbentDTO.rows.slice(0, this.manageAdsorbentDTO.nOfRecordPage);
      this.manageAdsorbentDTO.totalRecords = this.manageAdsorbentDTO.rows.length;
      this.manageAdsorbentDTO.numberOfRecords = this.manageAdsorbentDTO.rows.length;
    },
      (error) => {
        this.manageAdsorbentDTO.loading = false;
        this.notify.showError(error.message);
      });
  }

  onRoleEditClick(evt: any) {
    this.manageAdsorbentDTO.isDisabled = false;
    let sampleid;
    this.manageAdsorbent = new ManageAdsorbents();
    this.productName = new ProductName();
    this.adsorbentService.getById(evt.id).subscribe(role => {
      this.manageAdsorbent = role.data;
      if (this.manageAdsorbent.book) {
        this.manageAdsorbent.notebook = this.manageAdsorbent.book.split('-');
        this.manageAdsorbent.notePart1 = this.manageAdsorbent.notebook[0];
        this.manageAdsorbent.notePart2 = this.manageAdsorbent.notebook[1];
        this.manageAdsorbent.notePart3 = this.manageAdsorbent.notebook[2];
      }
      this.adsorbentService.getProductSubTypeDropDown(this.manageAdsorbent.productTypeId).subscribe(result => {
        result.data.forEach(data => {
          if (data.id === this.manageAdsorbent.productSubTypeId) {
            this.manageAdsorbentDTO.subTypeList = [data];
          }
        });
      });
      if (this.manageAdsorbent.limsSampleId) {
        sampleid = this.manageAdsorbent.limsSampleId;
        this.manageAdsorbent.limsSampleId = sampleid.split(',');
        this.manageAdsorbentDTO.uopNoteLotFlg = true;
      }

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  find(manageAdsorbent: any) {


    this.manageAdsorbentDTO.loading = true;
    this.manageAdsorbent.technologyId = localStorage.getItem('technology');
    if (manageAdsorbent.limsSampleId !== undefined && manageAdsorbent.limsSampleId !== null) {
      manageAdsorbent.limsSampleId = manageAdsorbent.limsSampleId.toString();
    }
    this.adsorbentService.findAdsorbenttData(manageAdsorbent).subscribe(result => {

      this.manageAdsorbentDTO.rows = result.body.data;

      this.manageAdsorbentDTO.totalRecords = this.manageAdsorbentDTO.rows.length;
      this.notify.showSuccess(result.body.message);
      this.manageAdsorbentDTO.loading = false;
    },
      (error) => {
        this.manageAdsorbentDTO.loading = false;
        this.notify.showError(error.message);
        this.manageAdsorbentDTO.manageAdsorbentList = null;
        this.manageAdsorbentDTO.totalRecords = 0;
      });

  }


  deleteConfirmation(manageAdsorbent: any) {
    this.manageAdsorbentDTO.techId = manageAdsorbent.id;
    this.commonService.modelConfirmation();
    this.commonService.configFlag.subscribe(flag => {
      if (flag) {
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });
  }

  onClickProductNameFlyOut(evt: any) {

    this.manageAdsorbentDTO.flyOutPopUp = true;
    this.getProductData();
    // this.manageAdsorbentDTO.adsorbentForm.reset();
  }
  getProductData() {

    this.adsorbentService.loading = true;
    this.adsorbentService.getAllProductName().subscribe(customerResult => {
      this.manageAdsorbentDTO.productDataList = customerResult.data;
      this.manageAdsorbentDTO.flyTotalRecords = this.manageAdsorbentDTO.productDataList.length;
      this.adsorbentService.loading = false;
    },
      (error) => {
        this.adsorbentService.loading = false;
        this.manageAdsorbentDTO.flyTotalRecords = 0;
        this.notify.showError(error.message);
      });
  }
  onProductEdit(product: any) {
    this.manageAdsorbent.productName = product.productName;
    this.manageAdsorbent.productId = product.id;
    this.manageAdsorbent.productTypeId = product.productTypeId;
    this.manageAdsorbent.productTypeId = product.productTypeId;
    this.manageAdsorbent.productSubTypeId = product.productSubTypeId;
    // call subtype dropdown by sending product type Id
    this.getProductSubTypeDropDown(this.manageAdsorbent.productTypeId);
    const flyoutModelClose = document.getElementById('productFlyOut');
    flyoutModelClose.click();
  }
  onFindClickPop(data: any) {
    if (this.manageAdsorbentDTO.adsorbentForm.valid && this.manageAdsorbentDTO.adsorbentForm.dirty) {
      this.adsorbentService.loading = true;
      this.adsorbentService.findProductData(data).subscribe(resultSet => {

        this.manageAdsorbentDTO.productDataList = resultSet.body.data;
        this.manageAdsorbentDTO.flyTotalRecords = this.manageAdsorbentDTO.productDataList.length;
        this.adsorbentService.loading = false;
        this.notify.showSuccess(resultSet.body.message);
      },
        (error) => {
          this.adsorbentService.loading = false;
          this.manageAdsorbentDTO.flyTotalRecords = 0;
          this.notify.showError(error.message);
        });
    } else {
      this.notify.showError('Enter at least one field to FIND');
    }
  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.manageAdsorbentDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.getTechnologies();
        this.dashboardService.showTechnologyHeader = true;
        this.adsorbentService.loading = false;
        this.manageAdsorbentDTO.uomInput = false;
        this.manageAdsorbentDTO.uomDirty = false;
        this.manageAdsorbentDTO.uopNoteLotFlg = false;
        this.manageAdsorbentDTO.nOfRecordPage = 10;
        this.manageAdsorbentDTO.totalRecords = 10;
        this.manageAdsorbentDTO.nOfFlyRecordPage = 10;
        this.manageAdsorbentDTO.flyTotalRecords = 10;
        this.AdsorbentFromControls();
        this.AdsorbentFlyoutFromControls();
        // get local stored technology
        this.manageAdsorbent.technologyId = localStorage.getItem('technology');
        this.getProductTypeDropDown();
        this.getSampleTypeDropDown();
        this.getbinderTypeDropDown();
        this.getSizeTypeDropDown();
        this.getShapeTypeDropDown();
        this.getHfrDropDown();
        this.gethFrDropDown();
        this.gethfRDropDown();
        this.getConditionDropDown();
        this.absorbentGridData();

        this.manageAdsorbentDTO.columns = [
          { field: 'productName', header: 'Product Name' },
          { field: 'uop', header: 'UOP #' },
          { field: 'book', header: 'Notebook #' },
          { field: 'lot', header: 'Lot #' },
          { field: 'sampleTypeName', header: 'Sample Type' },
          { field: 'binderTypeName', header: 'Binder Type' },
          { field: 'sizeId', header: 'Normal Size' },
          { field: 'shapeId', header: 'Shape' },
          { field: 'hzrdNum', header: 'H' },
          { field: 'flameNum', header: 'F' },
          { field: 'reactNum', header: 'R' },
          { field: 'conditionName', header: 'Adsorbent Condition' }
        ];
        if (this.manageAdsorbentDTO.privilege) {
          this.manageAdsorbentDTO.columns.push({ field: 'action', header: 'Action' });
        }


        this.manageAdsorbentDTO.cols = [
          { field: 'productName', header: 'Product Name' },
          { field: 'productTypeName', header: 'Product Type ' },
          { field: 'productSubTypeName', header: 'Product Sub Type' }
        ];


      }
    });
  }
}

