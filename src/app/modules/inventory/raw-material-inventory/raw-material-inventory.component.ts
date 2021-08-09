import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { InventoryService } from './inventory.service';
import { Inventory, InventoryDTO, InventoryFlyoutDTO } from '../Inventory.model';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { ManageRawMaterialsService } from '../../manage/manage-raw-materials/manage-raw-materials.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { ManageRawMaterials } from '../../manage/manage-raw-materials/manage-raw-materials.model';
import { ManageVariableService } from '../../manage/manage-variables/manage-variable.service';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { CommonService } from '../../../shared/common-services/common.service';

@Component({
  selector: 'app-raw-material-inventory',
  templateUrl: './raw-material-inventory.component.html'
})
export class RawMaterialInventoryComponent implements OnInit, AfterViewChecked {

  inventoryDTO: InventoryDTO = new InventoryDTO();
  inventory: Inventory = new Inventory();
  inventoryFlyoutDTO: InventoryFlyoutDTO = new InventoryFlyoutDTO();
  rawMaterail = new ManageRawMaterials();
  uomObjList: any;
  uomObj: any;
  unitItems: any;
  unitItemsArray: any;
  constructor(private formBuilder: FormBuilder,
    private bsModalService: BsModalService,
    private router: Router,
    private notify: NotificationService,
    public inventoryService: InventoryService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private dashboardService: DashboadrdService,
    private manageVariableService: ManageVariableService, public manageRawMaterialsService: ManageRawMaterialsService) {
    this.inventoryDTO.privilage = this.commonService.applyPrivilege(this.route.snapshot.data.name);
    this.uomObjList = this.route.snapshot.data.uomData.data;
    this.dashboardService.sendHideFlag(true);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.getDesignationData();
    this.manageRawMaterialsService.loading = true;
    this.inventory.rawMaterialInventoryDetails[0] = NaN;
    this.inventoryDTO.numberOfRecordsPerPage = 10;
    this.inventoryFlyoutDTO.nOfFlyRecordPage = 10;
    this.inventoryDTO.route = this.router.url;
    this.uomObj = this.uomObjList[0];
    this.unitItems = this.uomObjList;
    this.unitItemsArray = this.uomObjList;
    this.inventoryFormControls();
    this.getTableColumnName();
    this.getFlyoutColumnName();
    this.flyoutFormControl();
    this.getAllInventory();
    this.inventoryDTO.defaultUnit = this.unitItems.filter(unit => unit.baseUnitStatus === 'Y');
  }
  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }
  inventoryFormControls() {
    this.inventoryDTO.inventoryForm = this.formBuilder.group({
      name: new FormControl(''),
      materialName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      rawMaterialInventoryDetails: this.formBuilder.array([this.createInventoryData()])
    });
  }
  flyoutFormControl() {
    this.inventoryFlyoutDTO.flyoutForm = this.formBuilder.group({
      designation: ['']
    });
  }
  getTableColumnName() {

    this.inventoryDTO.columns = [
      { field: 'materialName', header: 'Name' },
      { field: 'totalQuantity', header: 'Total Quantity' },
    ];
    if (this.inventoryDTO.privilage) {
      this.inventoryDTO.columns.push({ field: 'action', header: 'Action' });
    }
  }
  getFlyoutColumnName() {
    this.inventoryFlyoutDTO.cols = [
      { field: 'materialName', header: 'Name' }
    ];
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
    this.inventoryDTO.rawMaterialInventoryDetails = this.inventoryDTO.inventoryForm.get('rawMaterialInventoryDetails') as FormArray;
    this.inventoryDTO.rawMaterialInventoryDetails.push(this.createInventoryData());
  }


  get formArray(): FormArray {
    this.inventoryDTO.rawMaterialInventoryDetails = this.inventoryDTO.inventoryForm.get('rawMaterialInventoryDetails') as FormArray;
    return this.inventoryDTO.rawMaterialInventoryDetails;
  }

  remove(index: number) {
    let totalQuantity = 0;
    if (this.inventoryDTO.rawMaterialInventoryDetails.length !== 1) {
      this.inventoryDTO.rawMaterialInventoryDetails.removeAt(index);
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
    this.inventoryService.loading = true;
    this.inventoryDTO.isDisabled = true;
    inventory.materialName = this.inventory.materialName;
    this.inventory.totalQtyUOMId = this.inventoryDTO.unitIdArray[0];
    inventory.rawMaterialInventoryDetails.forEach((inventoryDetails, i) => {
      this.inventory.rawMaterialInventoryDetails.forEach((inventoryData, j) => {
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
    inventory.rawMaterialInventoryDetails.forEach((inventoryObj, i) => {
      inventoryObj.displayOrderNumber = i;
      inventoryObj.qtyUOMId = this.inventoryDTO.unitIdArray[i];
      inventoryObj.netQuantity = this.inventoryDTO.quantityArray[i];
    });
    if (this.inventoryDTO.totalQuantityUnit) {
      this.inventory.totalQtyUOMId = this.inventoryDTO.totalQuantityUnit;
    } else {
      this.inventory.totalQtyUOMId = this.inventoryDTO.defaultUnit[0].id;
    }
    this.inventory.rawMaterialInventoryDetails = inventory.rawMaterialInventoryDetails;
    if (this.inventory.id) {
      this.inventoryService.update(this.inventory).subscribe(result => {
        this.reset();
        this.inventoryDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
      },
        error => {
          this.inventoryService.loading = false;
          this.inventoryDTO.isDisabled = false;
          this.notify.showError(error.message);
        }
      );
    } else {
      this.inventoryService.save(this.inventory).subscribe(result => {
        this.reset();
        this.inventoryDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
      }, error => {
        this.inventoryService.loading = false;
        this.inventoryDTO.isDisabled = false;
        this.notify.showError(error.message);
      });
    }
  }

  reset() {
    this.unitItems = [];
    this.cd.detectChanges();
    this.reloadUomList();
    this.inventoryDTO.enableFind = false;
    this.inventoryDTO.totalRecords = 0;
    this.manageRawMaterialsService.loading = true;
    this.inventoryDTO.inventory = new Inventory();
    this.inventory = new Inventory();
    this.rawMaterail = new ManageRawMaterials();
    this.inventory.totalQuantity = NaN;
    this.inventoryDTO.quantityArray[0] = NaN;
    this.inventoryDTO.quantityArray = new Array();
    this.inventoryDTO.inventoryForm.reset();
    this.inventoryDTO.inventory = new Inventory();
    this.inventoryFormControls();
    this.getAllInventory();
  }
  reloadUomList() {
    this.unitItems = this.uomObjList;
  }
  find(inventory: any) {
    this.inventoryDTO.totalRecords = 0;
    if (this.inventoryDTO.inventoryForm.dirty || this.inventoryDTO.inventoryForm.valid
      || this.inventoryDTO.inventoryForm.controls['materialName'].valid || this.inventoryDTO.enableFind) {
      this.manageRawMaterialsService.loading = true;
      inventory.rawMaterialInventoryDetails.forEach((inventoryObj, i) => {
        inventoryObj.netQuantity = this.inventoryDTO.quantityArray[i];
      });
      const findObj = {
        rawMaterialInventoryDetails: inventory.rawMaterialInventoryDetails,
        materialId: this.inventory.materialId,
        totalQuantity: this.inventory.totalQuantity
      };
      this.inventoryService.findInventory(findObj).subscribe(result => {
        this.inventoryDTO.inventoryRecords = result.body.data;
        this.commonService.sendToggleFlagFind(true);

        this.inventoryDTO.totalRecords = this.inventoryDTO.inventoryRecords.length;
        if (result.status === 200) {
          this.manageRawMaterialsService.loading = false;
          this.notify.showSuccess(result.body.message);
        } else {
          this.manageRawMaterialsService.loading = false;
          this.notify.showError(result.body.message);
        }
      }, (error) => {
        this.manageRawMaterialsService.loading = false;
        this.inventoryDTO.totalRecords = 0;
        this.notify.showError(error.message);
      }
      );
    } else {
      this.notify.showError('Enter at least one field to search');
    }
  }

  inventoryEdit(inventoryObj: Inventory) {
    this.rawMaterail = new ManageRawMaterials();
    this.inventoryDTO.rawMaterialInventoryDetails.reset();
    this.manageRawMaterialsService.loading = true;
    this.inventoryDTO.isDisabled = false;
    this.inventory = new Inventory();
    this.inventoryFormControls();
    this.inventoryDTO.quantityArray = new Array();
    this.inventoryService.getById(inventoryObj.id).subscribe(response => {
      this.inventoryDTO.totalQuantity = NaN;
      const inventory = response.data;
      this.inventoryDTO.unitIdArray = [];
      const designationData = this.inventoryFlyoutDTO.colsData.filter(data => data.id === inventory.materialId);
      inventory.materialName = designationData[0].materialName;
      this.inventoryDTO.inventoryForm.patchValue({
        materialName: inventory.materialName
      });
      inventory.rawMaterialInventoryDetails.forEach((data, i) => {
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
      this.manageRawMaterialsService.loading = false;
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
        this.inventoryService.delete(this.inventoryDTO.inventoryId, sk).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.reset();
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
    });

  }
  getAllInventory() {
    this.inventoryService.getAll().subscribe(result => {
      this.inventoryDTO.inventoryRecords = result.data;
      this.manageRawMaterialsService.loading = false;
      this.inventoryDTO.totalRecords = this.inventoryDTO.inventoryRecords.length;
    },
      error => {
        this.manageRawMaterialsService.loading = false;
      });
  }


  getDesignationData() {
    this.manageRawMaterialsService.loading = true;
    this.manageRawMaterialsService.getAllManageRawMaterials().subscribe(res => {
      this.inventoryFlyoutDTO.colsData = res.data.filter(designation => designation.isRawMaterial === true);
      this.inventoryFlyoutDTO.flyTotalRecords = this.inventoryFlyoutDTO.colsData.length;
      this.manageRawMaterialsService.loading = false;
    });
  }


  flyoutLoad() {
    this.inventoryFlyoutDTO.designationFlyout = true;
  }



  designationSelect(data: any) {
    this.rawMaterail.materialName = data.materialName;
    this.inventory.materialId = data.id;
    this.inventoryDTO.desigNamtionId = data.id;
    this.inventoryDTO.inventoryForm.patchValue({
      materialName: data.materialName
    });
    this.inventory.materialName = data.materialName;
    const flyoutModelClose = document.getElementById('flyoutModal');
    flyoutModelClose.click();
    this.rawMaterail = new ManageRawMaterials();
  }

  updateTotalQuantity(data: any, index: number) {
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

  onFlyoutReset() {
    this.rawMaterail = new ManageRawMaterials();
    this.inventoryDTO.inventory.materialName = '';
    this.inventoryFlyoutDTO.flyoutForm.reset();
    this.getDesignationData();
    this.commonService.sendToggleFlagFind(true);

  }
  flyoutFind(data: any) {
    this.rawMaterail = new ManageRawMaterials();
    this.rawMaterail = data;
    this.manageRawMaterialsService.loading = true;
    data.isRawMaterial = true;
    this.manageRawMaterialsService.flyoutfind(data).subscribe(res => {
      this.inventoryFlyoutDTO.colsData = res.body.data;
      this.inventoryFlyoutDTO.flyTotalRecords = this.inventoryFlyoutDTO.colsData.length;
      this.commonService.sendToggleFlagFind(true);
      this.manageRawMaterialsService.loading = false;
      this.notify.showSuccess(res.body.message);
    }, (error) => {
      this.manageRawMaterialsService.loading = false;
      this.inventoryFlyoutDTO.flyTotalRecords = 0;
      this.notify.showError(error.message);
    });
  }
  totalQuantityValueChange(data) {
    this.inventoryDTO.totalQuantityUnit = data.id;
  }
  closeFlyout() {
    this.inventoryFlyoutDTO.flyoutForm.reset();

  }
}
