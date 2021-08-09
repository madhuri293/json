import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { CreateFeed, Customer, FeedStackDTO } from './feed-stack-create.model';
import { FeedCreateService } from './feed-create.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { TechnologyService } from '../../manage/technology/technology.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, StatusEnum, UomCategory, ValueType } from '../../../shared/enum/enum.model';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { ManageVariableService } from '../../manage/manage-variables/manage-variable.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-feed-stack-create',
  templateUrl: './feed-stack-create.component.html'
})
export class FeedStackCreateComponent implements OnInit {
  createFeed: CreateFeed = new CreateFeed();
  customer: Customer = new Customer();
  feedStackDTO: FeedStackDTO = new FeedStackDTO();
  categoryPlaceHolder: string;
  categoryValue: any;

  constructor(public manageVariableService: ManageVariableService,
    private dashboardService: DashboadrdService, private router: ActivatedRoute,
    private commonService: CommonService, private formBuilder: FormBuilder, private technologyService: TechnologyService,
    private notify: NotificationService, public feedCreateService: FeedCreateService, private bsModalService: BsModalService) {
    this.feedStackDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.refresh();
    this.dashboardService.showTechnologyHeader = true;
    this.feedCreateService.loading = true;
    this.categoryPlaceHolder = UomCategory.IBP;
    this.feedStackDTO.uomFlag = false;
    this.getFeedTypeData();
    this.getCategoryData();
    this.feedStackDTO.showtable = true;
    this.creatFeedFormControls();
    this.creatFeedPopUpFormControl();
    this.getTechnologies();
    this.getFeedStatus();
    this.feedStackDTO.customernOfRecordPage = 10;
    this.feedStackDTO.totalRecords1 = 10;
    this.feedStackDTO.nOfRecordPage = 10;
    this.feedStackDTO.numberOfRecords = 10;
    this.feedStackDTO.subCatRecords = [];

    this.feedStackDTO.cols = [

      { field: 'name', header: ' Name' },
      { field: 'city', header: 'City' },
      { field: 'country', header: 'Country' }
    ];

    this.feedStackDTO.colsData = [
      { field: 'uopNumber', subfield: '', header: 'UOP' },
      { field: 'bookNumber', subfield: '', header: 'Book' },
      { field: 'sfdcNumber', subfield: '', header: 'SFDC' },
      { field: 'feedName', subfield: '', header: 'Name' },
      { field: 'feedTypeName', subfield: '', header: 'Feed Type' },
      { field: 'categoryName', subfield: '', header: 'Category' },
      { field: 'subCategoryName', subfield: '', header: 'Sub Category' },
      { field: 'ibp', subfield: '', header: 'IBP' },
      { field: 'fbp', subfield: '', header: 'FBP' },
      { field: 'status', subfield: '', header: 'Status' }
    ];

    if (this.feedStackDTO.privilege) {
      this.feedStackDTO.colsData.push({ field: 'Delete', subfield: '', header: 'Action' });
    }
  }
  units(data) {
    if (data.length > 0) {
      this.getFeedStackData();

    }
  }
  creatFeedPopUpFormControl() {
    this.feedStackDTO.creatFeedPopUpForm = this.formBuilder.group({
      customerName: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl('')
    });
  }
  onResetClick() {
    this.feedStackDTO.totalRecords = 0; 
    this.feedCreateService.loading = true;
    this.customer = new Customer();
    this.createFeed = new CreateFeed();
    this.feedStackDTO.creatFeedForm.reset();
    this.feedStackDTO.creatFeedPopUpForm.reset();

    this.feedStackDTO.subCatRecords = [];
    this.categoryValue = NaN;
    this.categoryPlaceHolder = UomCategory.RESET;
    this.commonService.sendToggleFlag(true);
    this.feedStackDTO.uomFlag = false;
    this.feedStackDTO.formValid = false;
    this.getCategoryData();
    this.getTechnologies();
  }
  creatFeedFormControls() {
    this.feedStackDTO.creatFeedForm = this.formBuilder.group(
      {
        uopNumber: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(25),
        Validators.pattern(SPACE_REGEXP)])),
        bookNumber: new FormControl('', Validators.compose([Validators.required,
        Validators.maxLength(25), Validators.pattern(SPACE_REGEXP)])),
        sfdcNumber: new FormControl('', Validators.compose([Validators.maxLength(100),
        Validators.required, Validators.pattern(SPACE_REGEXP)])),
        name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern(SPACE_REGEXP)])),
        type: new FormControl('', Validators.compose([Validators.required])),
        category: new FormControl('', Validators.compose([Validators.required])),
        subCategory: new FormControl('', Validators.compose([Validators.required])),

        customer: new FormControl('', Validators.compose([Validators.required])),
        description: new FormControl('', Validators.compose([Validators.maxLength(1000)])),
        technologyCode: new FormControl('', Validators.compose([])),
        status: new FormControl('', Validators.compose([Validators.required]))
      }
    );
  }

  onResetClickPop() {
    this.customer = new Customer();
    this.createFeed.customerName = '';
    this.feedStackDTO.creatFeedPopUpForm.reset();
    this.getCustomerData();
    this.commonService.sendToggleFlagFind(true);

  }
  getFeedStackData() {

    this.feedCreateService.getAllFeeds().subscribe(feedresult => {
      this.feedCreateService.loading = false;
      feedresult.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.feedStackDTO.feedStackDataList = feedresult.data;
      this.feedStackDTO.totalRecords = this.feedStackDTO.feedStackDataList.length;

    },
      (error) => {
        this.feedCreateService.loading = false;
        this.notify.showError(error.message);
      });
  }

  getCustomerData() {
    this.feedCreateService.loading = true;
    this.feedCreateService.getAllCustomerData().subscribe(customerResult => {
      this.feedStackDTO.customerDataList = customerResult.data;
      this.feedStackDTO.totalRecords1 = this.feedStackDTO.customerDataList.length;
      this.feedCreateService.loading = false;
    },
      (error) => {
        this.feedCreateService.loading = false;
        this.notify.showError(error.message);
      });
  }

  getFeedTypeData() {
    this.feedCreateService.getFeedType().subscribe(feedTypeResult => {
      this.feedStackDTO.feedTypeData = feedTypeResult.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  getCategoryData() {
    this.feedCreateService.getCategoryType().subscribe(feedCategoryResult => {
      this.feedStackDTO.categoryTypeData = feedCategoryResult.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  closeFlyout() {
    if(this.createFeed.customerName === undefined || this.createFeed.customerName ===""){
      this.feedStackDTO.creatFeedPopUpForm.reset();

    } 

  }
  onEditClick(evt: any) {
    this.customer = new Customer();
    this.feedStackDTO.isDisable = true;
    this.feedStackDTO.formValid = true;
    this.categoryPlaceHolder = UomCategory.ROWEDIT;
    this.feedCreateService.getByCategoryId(evt.categoryId).subscribe(subCatResult => {
      this.feedStackDTO.subCatRecords = subCatResult.data;
      
      this.feedCreateService.getEditedRecordById(evt.id).subscribe(resultSet => {
        this.createFeed = resultSet.data;
        this.categoryValue = this.createFeed;
       
        this.feedStackDTO.formValid = true;
        this.feedStackDTO.uomFlag = true;
      },
        (error) => {
          this.notify.showError(error.message);
        });
    
    },
      (error) => {
        this.notify.showError(error.message);
      });
    
  }

  getTechnologies() {
    const selectedTechnology = localStorage.getItem('technology');
    this.dashboardService.getTechnologies().subscribe(result => {
      this.feedStackDTO.technologyData = result.data;
      this.feedStackDTO.technologyData = this.feedStackDTO.technologyData.filter(tech => tech.technologyId === selectedTechnology);
      this.feedStackDTO.technologyData = this.feedStackDTO.technologyData.
        filter(val => val.status === StatusEnum.Y);
    }, error => {
      this.notify.showError(error.message);
    });
  }
  getFeedStatus() {
    this.feedStackDTO.statusList = this.commonService.getStatusList();
  }
  onCustomerEdit(customer: any) {
    this.createFeed.customerName = customer.name;
    this.createFeed.customerId = customer.customerId;
    this.createFeed.customerLocationId = customer.customerLocationId;
    this.customer.name = customer.name;
    this.customer.city = customer.city;
    this.customer.country = customer.country;
    const flyoutModelClose = document.getElementById('feedFlyOut');
    flyoutModelClose.click();

  }

  onChangeStatus(status: any) {
    this.createFeed.statusId = status.id;
  }
  onFindClickPop(data: any) {
    if (this.feedStackDTO.creatFeedPopUpForm.valid || this.feedStackDTO.creatFeedPopUpForm.dirty) {
      this.feedCreateService.loading = true;
      this.feedCreateService.findCustomerData(data).subscribe(resultSet => {
        this.feedStackDTO.customerDataList = resultSet.body.data;
        this.commonService.sendToggleFlagFind(true);
        this.customer.name = data.name;
        this.customer.city = data.city;
        this.customer.country = data.country;
        this.feedStackDTO.totalRecords1 = this.feedStackDTO.customerDataList.length;
        this.feedCreateService.loading = false;
        this.notify.showSuccess(resultSet.body.message);
      },
        (error) => {
          this.feedCreateService.loading = false;
          this.feedStackDTO.numberOfRecords1 = 0;
          this.notify.showError(error.message);
        });
    } else {
      this.notify.showError('Enter at least one field to FIND');
    }
  }
  onClickFeedFlyOut(evt: any) {

    this.feedStackDTO.flyOutPopUp = true;
    this.getCustomerData();
  }
 
  onFindClick(data) {
    this.feedStackDTO.totalRecords = 0; 

    this.feedCreateService.loading = true;
   
    this.feedCreateService.findFeedData(data).subscribe(resultSet => {
      this.commonService.sendToggleFlagFind(true);

      this.notify.showSuccess(resultSet.body.message);
      this.feedStackDTO.feedStackDataList = resultSet.body.data;
      this.feedStackDTO.feedStackDataList.forEach(datae => {
        datae.status = this.commonService.getStatus(datae);
      });
      this.feedStackDTO.totalRecords = this.feedStackDTO.feedStackDataList.length;

      this.feedCreateService.loading = false;
    },
      (error) => {
        this.feedCreateService.loading = false;
        this.feedStackDTO.feedStackData = null;
        this.feedStackDTO.numberOfRecords = 0;
        this.notify.showError(error.message);
      });


  }
  changeCategory(categoryId: any) {
     this.feedStackDTO.formValid = false;
      this.feedCreateService.getByCategoryId(categoryId).subscribe(subCatResult => {
      this.feedStackDTO.subCatRecords = subCatResult.data;
      this.feedStackDTO.isDisable = false;
     
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  changesubCategory(subCategoryId: any) {
    this.feedStackDTO.formValid = true;
    this.feedStackDTO.isDisable = true;

  }
  onSaveClick(feedData: any) {
    this.feedStackDTO.isDisable = true;
    if (feedData.id) {
      this.createFeed.categoryId = feedData.categoryId;
      this.createFeed.subCategoryId = feedData.subCategoryId;
      this.createFeed.customerId = feedData.customerId;
      this.createFeed.feedType = feedData.feedType;
      this.feedCreateService.update(this.createFeed).subscribe(result => {
        this.feedStackDTO.totalRecords = 0; 
        this.notify.showSuccess(result.body.message);
        this.feedStackDTO.isDisable = false;
        this.createFeed = new CreateFeed();
        this.feedStackDTO.creatFeedForm.reset();
        this.feedStackDTO.subCatRecords = [];
        this.categoryValue = NaN;
        this.categoryPlaceHolder = UomCategory.RESET;
        this.onResetClick();
      },
        (error) => {
          this.feedStackDTO.isDisable = true;
          this.feedCreateService.loading = false;
          this.notify.showError(error.message);
        });

    } else {
      this.createFeed.categoryId = feedData.categoryId;
      this.createFeed.subCategoryId = feedData.subCategoryId;
      this.createFeed.customerId = feedData.customerId;
      this.createFeed.feedType = feedData.feedType;
      this.createFeed.id = '';
      this.feedCreateService.save(this.createFeed).subscribe(result => {
        this.feedStackDTO.totalRecords = 0; 
        this.notify.showSuccess(result.body.message);
        this.createFeed = new CreateFeed();
        this.feedStackDTO.creatFeedForm.reset();
        this.feedStackDTO.isDisable = false;
        this.feedStackDTO.subCatRecords = [];
        this.categoryValue = NaN;
        this.categoryPlaceHolder = UomCategory.RESET;
        this.onResetClick();

      }, (error) => {
        this.feedStackDTO.isDisable = true;
        this.feedCreateService.loading = false;
        this.notify.showError(error.message);
      });
    }
  }
  feedValue(value, type) {
    this.feedStackDTO.uomFlag = true;
    if (value === null) {
      if (type === ValueType.TYPE1) {
        this.createFeed.ibp = NaN;
      } else {
        this.createFeed.fbp = NaN;
      }
      this.feedStackDTO.formValid = false;
    } else {
      if (type === ValueType.TYPE1) {
        this.createFeed.ibp = value;
      } else if (type === ValueType.TYPE2) {
        this.createFeed.fbp = value;
      }
      if (this.createFeed.ibp !== undefined && this.createFeed.fbp !== undefined &&
        !isNaN(this.createFeed.ibp) && !isNaN(this.createFeed.fbp)) {
        this.feedStackDTO.formValid = true;
      } 
    }
  }

  feedValue1(val) {
    if (val.name === UomCategory.IBP) {
      this.createFeed.ibp = val.value;
      this.categoryValue = val.value;
      this.categoryPlaceHolder = val.name;
    } else {
      this.createFeed.fbp = val.value;
      this.categoryValue = val.value;
      this.categoryPlaceHolder = val.name;
    }



    if (this.createFeed.ibp !== null && this.createFeed.ibp !== undefined &&
      this.createFeed.fbp !== null && this.createFeed.fbp !== undefined) {
      this.feedStackDTO.formValid = true;
      this.feedStackDTO.uomFlag = true;
    } else {
      this.feedStackDTO.formValid = false;
      this.feedStackDTO.uomFlag = false;
    }

  }

  deleteConfirmation(createFeed: any) {
    this.feedStackDTO.idToDelete = createFeed.id;
    this.createFeed.sk = createFeed.technologyId;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onFeedStackDelete(this.feedStackDTO.idToDelete, this.createFeed.sk);
      }
    });
  }

  onFeedStackDelete(id: number, sk: any) {
    this.feedCreateService.delete(id, sk).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.onResetClick();
    },
      (error) => {
        this.notify.showError(error.error.Message);
      });
  }

  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.feedStackDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.feedCreateService.loading = true;
        this.categoryPlaceHolder = UomCategory.IBP;
        this.feedStackDTO.uomFlag = false;
        this.getFeedTypeData();
        this.getCategoryData();
        this.feedStackDTO.showtable = true;
        this.creatFeedFormControls();
        this.creatFeedPopUpFormControl();
        this.getTechnologies();
        this.getFeedStatus();
        this.feedStackDTO.customernOfRecordPage = 10;
        this.feedStackDTO.totalRecords1 = 10;
        this.feedStackDTO.nOfRecordPage = 10;
        this.feedStackDTO.totalRecords = 10;
        this.feedStackDTO.numberOfRecords = 10;
        this.feedStackDTO.subCatRecords = [];

        this.feedStackDTO.cols = [

          { field: 'name', header: ' Name' },
          { field: 'city', header: 'City' },
          { field: 'country', header: 'Country' }
        ];

        this.feedStackDTO.colsData = [
          { field: 'uopNumber', subfield: '', header: 'UOP' },
          { field: 'bookNumber', subfield: '', header: 'Book' },
          { field: 'sfdcNumber', subfield: '', header: 'SFDC' },
          { field: 'feedName', subfield: '', header: 'Name' },
          { field: 'feedTypeName', subfield: '', header: 'Feed Type' },
          { field: 'categoryName', subfield: '', header: 'Category' },
          { field: 'subCategoryName', subfield: '', header: 'Sub Category' },
          { field: 'ibp', subfield: '', header: 'IBP' },
          { field: 'fbp', subfield: '', header: 'FBP' },
          { field: 'status', subfield: '', header: 'Status' }
        ];

        if (this.feedStackDTO.privilege) {
          this.feedStackDTO.colsData.push({ field: 'Delete', subfield: '', header: 'Action' });
        }
        this.feedCreateService.loading = false;
      }
    })
  }

}


