import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { Inventory, InventoryDTO, InventoryFlyoutDTO } from '../Inventory.model';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { CatalystInventoryServiceService } from './catalyst-inventory-service.service';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { CatalystMainMastersService } from '../../catalyst/catalyst-main-masters/catalyst-main-masters.service';
import { BsModalService } from 'ngx-bootstrap';
import { CatalystMainMasters } from '../../catalyst/catalyst-main-masters/catalyst-main-masters.model';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { CommonService } from '../../../shared/common-services/common.service';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';

@Component({
  selector: 'app-catalyst-inventory-management',
  templateUrl: './catalyst-inventory-management.component.html',
})
export class CatalystInventoryManagementComponent implements OnInit, AfterViewChecked {

  inventoryDTO: InventoryDTO = new InventoryDTO();
  mainMaster: CatalystMainMasters = new CatalystMainMasters();
  inventoryFlyoutDTO: InventoryFlyoutDTO = new InventoryFlyoutDTO();
  inventory: Inventory = new Inventory();

  unitItems: any = [];
  uomObjList: any = [];
  uomObj: any = [];
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private notify: NotificationService,
    public catalystInventoryServiceService: CatalystInventoryServiceService,
    public catalystMainMasterService: CatalystMainMastersService,
    private commonService: CommonService,
    private dashboardService: DashboadrdService,
    private bsModalService: BsModalService,
    private cd: ChangeDetectorRef
  ) {
    this.catalystInventoryServiceService.loading = true;
    this.dashboardService.sendHideFlag(true);
    this.inventoryDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
    this.uomObjList = this.route.snapshot.data.uomData.data;
  }
  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }
  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.inventoryDTO.numberOfRecordsPerPage = 10;
    this.inventoryFlyoutDTO.nOfFlyRecordPage = 10;
    this.uomObj = this.uomObjList[0];
    this.unitItems = this.uomObjList;
    this.inventoryFormControls();
    this.getTableColumnName();
    this.getFlyoutColumnName();
    this.getMainMasterData();
    this.flyoutFormControl();
    this.getAllInventory();
    this.inventoryDTO.defaultUnit = this.unitItems.filter(unit => unit.baseUnitStatus === 'Y');
  }
  inventoryFormControls() {
    this.inventoryDTO.inventoryForm = this.formBuilder.group({
      catalystName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      catalystInventoryDetails: this.formBuilder.array([this.createInventoryData()]),
    });
  }
  flyoutFormControl() {
    this.inventoryFlyoutDTO.flyoutForm = this.formBuilder.group({
      designation: ['']
    });
  }

  createInventoryData(): FormGroup {
    return this.formBuilder.group({
      container: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(32),
      Validators.pattern(SPACE_REGEXP)])),
      book: new FormControl('', Validators.compose([Validators.maxLength(32)])),
      location: new FormControl('', Validators.compose([Validators.maxLength(16)])),
      site: new FormControl('', Validators.compose([Validators.maxLength(16)])),
      netQuantity: new FormControl('', Validators.compose([Validators.maxLength(255)]))
    });
  }

  addInventoryData() {
    this.inventoryDTO.catalystInventoryDetails = this.inventoryDTO.inventoryForm.get('catalystInventoryDetails') as FormArray;
    this.inventoryDTO.catalystInventoryDetails.push(this.createInventoryData());
  }


  get formArray(): FormArray {
    this.inventoryDTO.catalystInventoryDetails = this.inventoryDTO.inventoryForm.get('catalystInventoryDetails') as FormArray;
    return this.inventoryDTO.catalystInventoryDetails;
  }

  remove(index: number) {
    let totalQuantity = 0;
    if (this.inventoryDTO.catalystInventoryDetails.length !== 1) {
      this.inventoryDTO.catalystInventoryDetails.removeAt(index);
      this.inventory.catalystInventoryDetails.splice(index, 1);
      this.inventoryDTO.quantityArray.splice(index, 1);
      this.inventoryDTO.unitIdArray.splice(index, 1);
      this.inventoryDTO.quantityArray.forEach(res => {
        if (!isNaN(res)) {
          totalQuantity += +res;
        }
      });
      if (totalQuantity) {
        this.inventory.totalQuantity = totalQuantity;
      } else {
        this.inventory.totalQuantity = NaN;
      }
    }
  }


  save(inventory: any) {
    this.catalystInventoryServiceService.loading = true;
    this.inventoryDTO.isDisabled = true;
    inventory.catalystInventoryDetails.forEach((inventoryDetails, i) => {
      this.inventory.catalystInventoryDetails.forEach((inventoryData, j) => {
        if (i === j) {
          inventoryDetails.data = inventoryData.data;
          inventoryDetails.id = inventoryData.id;
          inventoryDetails.inventoryId = inventoryData.inventoryId;
          inventoryDetails.itemType = inventoryData.itemType;
          inventoryDetails.updatedByUserId = inventoryData.updatedByUserId;
          inventoryDetails.updatedOnDate = inventoryData.updatedOnDate;
          inventoryDetails.createdByUserId = inventoryData.createdByUserId;
          inventoryDetails.createdOnDate = inventoryData.createdOnDate;
        }
      });
    });
    inventory.catalystInventoryDetails.forEach((inventoryObj, i) => {
      inventoryObj.displayOrderNumber = i;
      inventoryObj.qtyUOMId = this.inventoryDTO.unitIdArray[i];
      inventoryObj.netQuantity = this.inventoryDTO.quantityArray[i];
    });
    if (this.inventoryDTO.totalQuantityUnit) {
      this.inventory.totalQtyUOMId = this.inventoryDTO.totalQuantityUnit;
    } else {
      if (this.inventory.totalQuantity) {
        this.inventory.totalQtyUOMId = this.inventoryDTO.defaultUnit[0].id;
      }
    }
    this.inventory.catalystInventoryDetails = inventory.catalystInventoryDetails;
    if (this.inventory.id) {
      this.catalystInventoryServiceService.update(this.inventory).subscribe(result => {
        this.reset();
        this.inventoryDTO.isDisabled = false;
        this.catalystInventoryServiceService.loading = false;
        this.notify.showSuccess(result.body.message);
      },
        error => {
          this.catalystInventoryServiceService.loading = false;
          this.inventoryDTO.isDisabled = false;
          this.notify.showError(error.message);
        }
      );
    } else {
      this.catalystInventoryServiceService.save(this.inventory).subscribe(result => {
        this.reset();
        this.inventoryDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.catalystInventoryServiceService.loading = false;
      }, error => {
        this.inventoryDTO.isDisabled = false;
        this.notify.showError(error.message);
        this.catalystInventoryServiceService.loading = false;
      });
    }
  }

  reset() {
    this.unitItems = [];
    this.cd.detectChanges();
    this.reloadUomList();
    this.inventoryDTO.enableFind = false;
    this.inventoryDTO.inventoryRecords = [];
    this.inventory.totalQuantity = NaN;
    this.catalystInventoryServiceService.loading = true;
    this.inventory = new Inventory();
    this.mainMaster = new CatalystMainMasters();
    this.inventoryFlyoutDTO.flyoutForm.reset();
    this.inventoryDTO.quantityArray[0] = NaN;
    this.inventoryDTO.inventoryForm.reset();
    this.inventoryDTO.catalystInventoryDetails.reset();
    this.inventoryFormControls();
    this.getAllInventory();
    this.inventoryDTO.quantityArray = new Array();
    this.inventory.totalQuantity = NaN;
  }
  reloadUomList() {
    this.unitItems = this.uomObjList;
  }

  find(inventory: any) {
    this.inventoryDTO.totalRecords = 0;
    this.catalystInventoryServiceService.loading = true;
    if (this.inventoryDTO.inventoryForm.dirty || this.inventoryDTO.inventoryForm.valid
      || this.inventoryDTO.inventoryForm.controls['catalystName'].valid || this.inventoryDTO.enableFind) {
      inventory.catalystInventoryDetails.forEach((inventoryObj, i) => {
        inventoryObj.netQuantity = this.inventoryDTO.quantityArray[i];
      });
      const findObj = {
        catalystInventoryDetails: inventory.catalystInventoryDetails,
        catalystId: this.inventory.catalystId,
        totalQuantity: this.inventory.totalQuantity
      };
      this.catalystInventoryServiceService.findInventory(findObj).subscribe(result => {
        this.inventoryDTO.inventoryRecords = result.body.data;
        this.commonService.sendToggleFlagFind(true);
        this.inventoryDTO.totalRecords = this.inventoryDTO.inventoryRecords.length;
        this.catalystInventoryServiceService.loading = false;
        this.notify.showSuccess(result.body.message);
      }, (error) => {
        this.catalystInventoryServiceService.loading = false;
        this.inventoryDTO.totalRecords = 0;
        this.notify.showError(error.message);
      }
      );
    } else {
      this.notify.showError('Enter at least one field to search');
    }
  }

  inventoryEdit(inventoryObj: Inventory) {
    this.inventoryDTO.isDisabled = false;
    this.catalystInventoryServiceService.loading = true;
    this.inventory = new Inventory();
    this.mainMaster = new CatalystMainMasters();
    this.inventoryFormControls();
    this.inventoryDTO.quantityArray = new Array();
    this.catalystInventoryServiceService.getById(inventoryObj.id).subscribe(response => {
      const inventory = response.data;
      this.inventoryDTO.unitIdArray = [];
      const mainmasterData = this.inventoryFlyoutDTO.mainMasterList.filter(mainmaster => mainmaster.id === inventory.catalystId);
      inventory.catalystName = mainmasterData[0].designationName;
      this.inventoryDTO.inventoryForm.patchValue({
        catalystName: inventory.catalystName
      });
      inventory.catalystInventoryDetails.forEach((data, i) => {
        if (data.netQuantity) {
          this.inventoryDTO.quantityArray.push(Number(data.netQuantity));
        } else {
          this.inventoryDTO.quantityArray.push(NaN);
        }

        this.inventoryDTO.unitIdArray.push(data.qtyUOMId);
        this.addInventoryData();
        this.formArray.controls[i].patchValue({
          container: data.container,
          location: data.location,
          book: data.book,
          site: data.site
        });
      });
      this.remove(this.formArray.length - 1);
      this.inventory.totalQuantity = Number(inventory.totalQuantity);
      this.inventory = inventory;
      this.catalystInventoryServiceService.loading = false;
    },
      error => {
        this.catalystInventoryServiceService.loading = false;
        this.notify.showError(error.message);
      });
  }

  inventoryDelete(inventory: Inventory) {
    this.inventoryDTO.inventoryId = inventory.id;
    const sk = inventory.sk;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((flag: boolean) => {
      if (flag) {
        this.catalystInventoryServiceService.delete(this.inventoryDTO.inventoryId, sk).subscribe(res => {
          this.reset();
          this.notify.showSuccess(res.body.message);
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
    });

  }


  getAllInventory() {
    this.catalystInventoryServiceService.loading = true;
    this.catalystInventoryServiceService.getAll().subscribe(result => {
      this.inventoryDTO.inventoryList = result.data;
      this.catalystInventoryServiceService.loading = false;
      this.inventoryDTO.totalRecords = this.inventoryDTO.inventoryList.length;
      this.inventoryDTO.inventoryRecords = this.inventoryDTO.inventoryList.splice(0, this.inventoryDTO.numberOfRecordsPerPage);
    },
      error => {
        this.catalystInventoryServiceService.loading = false;
      });
  }
  getTableColumnName() {
    this.inventoryDTO.columns = [
      { field: 'catalystName', header: 'Name' },
      { field: 'totalQuantity', header: 'Total Quantity' }
    ];
    if (this.inventoryDTO.privilege) {
      this.inventoryDTO.columns.push({ field: 'action', header: 'Action' });
    }
  }
  netQuantityValueChange(data: any, index: number) {
    this.inventoryDTO.enableFind = true;
    this.inventoryDTO.quantityArray[index] = data.baseValue;
    if (data.baseValue) {
      this.inventoryDTO.unitIdArray[index] = data.id;
    } else {
      if (isNaN(data.baseValue) || data.baseValue == null) {
        this.inventoryDTO.unitIdArray[index] = null;
      } else {
        this.inventoryDTO.unitIdArray[index] = data.id;
      }
    }
    let totalQuantity = 0;
    this.inventoryDTO.quantityArray.forEach(element => {
      if (!isNaN(element)) {
        totalQuantity += +element;
      }
    });
    if (totalQuantity) {
      this.inventory.totalQuantity = totalQuantity;
    } else {
      this.inventory.totalQuantity = NaN;
    }
  }

  totalQuantityValueChange(data: any) {
    this.inventoryDTO.totalQuantityUnit = data.id;
  }
  getFlyoutColumnName() {
    this.inventoryFlyoutDTO.cols = [
      { field: 'designationName', header: 'Designation' }
    ];
  }

  getMainMasterData() {
    this.catalystInventoryServiceService.loading = true;
    this.catalystMainMasterService.getCatalystMain(res => {
      this.inventoryFlyoutDTO.mainMasterList = res.data;
      this.inventoryFlyoutDTO.flyTotalRecords = this.inventoryFlyoutDTO.mainMasterList.length;
      this.catalystInventoryServiceService.loading = false;
    });
  }

  flyoutLoad() {
    this.inventoryFlyoutDTO.designationFlyout = true;
  }


  designationSelect(data: any) {
    this.catalystInventoryServiceService.loading = true;
    this.inventory.catalystName = data.designationName;
    this.inventoryDTO.desigNamtionId = data.id;
    this.inventory.catalystId = data.id;
    this.inventoryDTO.inventoryForm.patchValue({
      catalystName: data.designationName
    });
    const flyoutModelClose = document.getElementById('flyoutModal');
    flyoutModelClose.click();
    this.catalystInventoryServiceService.loading = false;
  }

  onFlyoutReset() {
    this.mainMaster = new CatalystMainMasters();
    this.inventoryFlyoutDTO.flyoutForm.reset();
    this.getMainMasterData();
    this.commonService.sendToggleFlagFind(true);
    this.catalystInventoryServiceService.loading = true;
    setTimeout(() => {
      this.catalystInventoryServiceService.loading = false;
    }, 1000);
  }
  flyoutFind(data: any) {
    this.catalystInventoryServiceService.loading = true;
    data.technologyId = localStorage.getItem('technology');
    this.catalystMainMasterService.find(data).subscribe(res => {
      this.inventoryFlyoutDTO.mainMasterList = res.body.data;
      this.inventoryFlyoutDTO.flyTotalRecords = this.inventoryFlyoutDTO.mainMasterList.length;
      this.notify.showSuccess(res.body.message);
      this.commonService.sendToggleFlagFind(true);
      this.catalystInventoryServiceService.loading = false;

    }, (error) => {
      this.catalystInventoryServiceService.loading = false;
      this.notify.showError(error.message);
    });
  }
  closeFlyout() {
    this.inventoryFlyoutDTO.flyoutForm.reset();
  }
}
