import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Inventory, InventoryDTO, InventoryFlyoutDTO } from '../Inventory.model';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { SynthesizeService } from './synthesize.service';
import { ManageRawMaterialsService } from '../../manage/manage-raw-materials/manage-raw-materials.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { ManageRawMaterials } from '../../manage/manage-raw-materials/manage-raw-materials.model';
import { CommonService } from '../../../shared/common-services/common.service';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';

@Component({
  selector: 'app-synthesized-material-inventory-management',
  templateUrl: './synthesized-material-inventory-management.component.html'
})
export class SynthesizedMaterialInventoryManagementComponent implements OnInit, AfterViewChecked {
  inventoryDTO: InventoryDTO = new InventoryDTO();
  inventory: Inventory = new Inventory();
  rawMaterail = new ManageRawMaterials();
  inventoryFlyoutDTO: InventoryFlyoutDTO = new InventoryFlyoutDTO();
  uomObjList: any;
  uomObj: any;
  unitItems: any;
  constructor(private formBuilder: FormBuilder,
    private notify: NotificationService,
    public synthesizeService: SynthesizeService,
    private commonService: CommonService,
    private dashboardService: DashboadrdService,
    private manageRawMaterialsService: ManageRawMaterialsService,
    private cd: ChangeDetectorRef,
    private router: ActivatedRoute,
    private bsModalService: BsModalService) {
    this.inventoryDTO.privilage = this.commonService.applyPrivilege(this.router.snapshot.data.name);
    this.uomObjList = this.router.snapshot.data.uomData.data;
    this.dashboardService.sendHideFlag(true);

  }

  ngOnInit() {
    this.synthesizeService.loading = true;
    this.dashboardService.showTechnologyHeader = false;
    this.inventory.synthesizedMaterialInventoryDetails[0] = NaN;
    this.inventoryDTO.numberOfRecordsPerPage = 10;
    this.inventoryFlyoutDTO.nOfFlyRecordPage = 10;
    this.inventoryFlyoutDTO.flyTotalRecords = 10;
    this.uomObj = this.uomObjList[0];
    this.unitItems = this.uomObjList;
    this.inventoryFormControls();
    this.flyoutFormControl();
    this.getDesignationData();
    this.getAllInventory();
    this.inventoryDTO.defaultUnit = this.unitItems.filter(unit => unit.baseUnitStatus === 'Y');
    this.inventoryDTO.columns = [
      { field: 'materialName', header: 'Name' },
      { field: 'totalQuantity', header: 'Total Quantity' },

    ];
    if (this.inventoryDTO.privilage) {
      this.inventoryDTO.columns.push({ field: 'action', header: 'Action' });
    }
    this.inventoryFlyoutDTO.cols = [

      { field: 'materialName', header: 'Name' }
    ];

  }
  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }
  inventoryFormControls() {
    this.inventoryDTO.inventoryForm = this.formBuilder.group({
      name: new FormControl(''),
      materialName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
      synthesizedMaterialInventoryDetails: this.formBuilder.array([this.createInventoryData()])
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
    this.inventoryDTO.synthesizedMaterialInventoryDetails =
      this.inventoryDTO.inventoryForm.get('synthesizedMaterialInventoryDetails') as FormArray;
    this.inventoryDTO.synthesizedMaterialInventoryDetails.push(this.createInventoryData());
  }


  get formArray(): FormArray {
    this.inventoryDTO.synthesizedMaterialInventoryDetails =
      this.inventoryDTO.inventoryForm.get('synthesizedMaterialInventoryDetails') as FormArray;
    return this.inventoryDTO.synthesizedMaterialInventoryDetails;
  }

  remove(index: number) {
    let totalQuantity = 0;
    if (this.inventoryDTO.synthesizedMaterialInventoryDetails.length !== 1) {
      this.inventoryDTO.synthesizedMaterialInventoryDetails.removeAt(index);
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
    this.synthesizeService.loading = true;
    this.inventoryDTO.isDisabled = true;
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
    inventory.materialName = this.inventory.materialName;
    inventory.synthesizedMaterialInventoryDetails.forEach((inventoryDetails, i) => {
      this.inventory.synthesizedMaterialInventoryDetails.forEach((inventoryData, j) => {
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
    inventory.synthesizedMaterialInventoryDetails.forEach((inventoryObj, i) => {
      inventoryObj.displayOrderNumber = i;
      inventoryObj.qtyUOMId = this.inventoryDTO.unitIdArray[i];
      inventoryObj.netQuantity = this.inventoryDTO.quantityArray[i];
    });
    if (this.inventoryDTO.totalQuantityUnit) {
      this.inventory.totalQtyUOMId = this.inventoryDTO.totalQuantityUnit;
    } else {
      this.inventory.totalQtyUOMId = this.inventoryDTO.defaultUnit[0].id;
    }
    this.inventory.synthesizedMaterialInventoryDetails = inventory.synthesizedMaterialInventoryDetails;
    if (this.inventory.id) {
      this.synthesizeService.update(this.inventory).subscribe(result => {
        this.reset();
        this.inventoryDTO.isDisabled = false;
        this.synthesizeService.loading = false;
        this.notify.showSuccess(result.body.message);
      },
        error => {
          this.synthesizeService.loading = false;
          this.inventoryDTO.isDisabled = false;
          this.notify.showError(error.message);
        }
      );
    } else {
      this.synthesizeService.save(this.inventory).subscribe(result => {
        this.reset();
        this.inventoryDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.synthesizeService.loading = false;
      }, error => {
        this.inventoryDTO.isDisabled = false;
        this.notify.showError(error.message);
        this.synthesizeService.loading = false;
      });
    }
  }

  reset() {
    this.unitItems = [];
    this.cd.detectChanges();
    this.reloadUomList();
    this.inventoryDTO.totalRecords = 0;
    this.inventory.totalQuantity = NaN;
    this.synthesizeService.loading = true;
    this.inventory = new Inventory();
    this.rawMaterail = new ManageRawMaterials();
    this.inventoryDTO.quantityArray[0] = NaN;
    this.inventoryDTO.inventoryForm.reset();
    this.inventoryDTO.synthesizedMaterialInventoryDetails.reset();
    this.inventoryFormControls();
    this.getAllInventory();
    this.inventoryDTO.quantityArray = new Array();
    this.inventory.totalQuantity = NaN;
    this.inventoryDTO.enableFind = false;
  }
  reloadUomList() {
    this.unitItems = this.uomObjList;
  }
  find(inventory: any) {
    this.inventoryDTO.totalRecords = 0;
    this.synthesizeService.loading = true;
    if (this.inventoryDTO.inventoryForm.dirty || this.inventoryDTO.inventoryForm.valid
      || this.inventoryDTO.inventoryForm.controls['materialName'].valid || this.inventoryDTO.enableFind) {
      inventory.synthesizedMaterialInventoryDetails.forEach((inventoryObj, i) => {
        inventoryObj.netQuantity = this.inventoryDTO.quantityArray[i];
      });
      const findObj = {
        synthesizedMaterialInventoryDetails: inventory.synthesizedMaterialInventoryDetails,
        materialId: this.inventory.materialId,
        totalQuantity: this.inventory.totalQuantity
      };
      this.synthesizeService.findInventory(findObj).subscribe(result => {
        this.inventoryDTO.inventoryRecords = result.body.data;
        this.commonService.sendToggleFlagFind(true);
        this.inventoryDTO.totalRecords = this.inventoryDTO.inventoryRecords.length;
        this.synthesizeService.loading = false;
        this.notify.showSuccess(result.body.message);
      }, (error) => {
        this.synthesizeService.loading = false;
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
    this.synthesizeService.loading = true;
    this.inventoryDTO.isDisabled = true;
    this.inventory = new Inventory();
    this.inventoryDTO.quantityArray = new Array();
    this.inventoryFormControls();
    this.synthesizeService.getById(inventoryObj.id).subscribe(response => {
      const inventory = response.data;
      this.inventoryDTO.unitIdArray = [];
      const designationData = this.inventoryFlyoutDTO.colsData.filter(data => data.id === inventory.materialId);
      inventory.materialName = designationData[0].materialName;
      this.inventoryDTO.inventoryForm.patchValue({
        materialName: inventory.materialName
      });
      inventory.synthesizedMaterialInventoryDetails.forEach((data, i) => {
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
      this.inventory.materialName = inventory.materialName;
      this.remove(this.formArray.length - 1);
      this.inventory.totalQuantity = Number(inventory.totalQuantity);
      this.inventory = inventory;
      this.synthesizeService.loading = false;
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
        this.synthesizeService.loading = true;
        this.synthesizeService.delete(this.inventoryDTO.inventoryId, sk).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.reset();
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
    });
  }


  getAllInventory() {
    this.synthesizeService.getAll().subscribe(result => {
      this.inventoryDTO.inventoryRecords = result.data;
      this.synthesizeService.loading = false;
      this.inventoryDTO.totalRecords = this.inventoryDTO.inventoryRecords.length;
    },
      error => {
        this.synthesizeService.loading = false;
      });
  }



  getDesignationData() {
    this.synthesizeService.loading = true;
    this.synthesizeService.getAllSynthesizedMaterials().subscribe(res => {
      this.inventoryFlyoutDTO.colsData = res.data.filter(designation => designation.isRawMaterial === false);
      this.inventoryFlyoutDTO.flyTotalRecords = this.inventoryFlyoutDTO.colsData.length;
      this.synthesizeService.loading = false;
    });
  }



  flyoutLoad() {
    this.inventoryFlyoutDTO.designationFlyout = true;
  }

  designationSelect(data) {
    this.inventory.materialName = data.materialName;
    this.inventoryDTO.desigNamtionId = data.id;
    this.inventory.materialId = data.id;
    this.inventoryDTO.inventoryForm.patchValue({
      materialName: data.materialName
    });
    const flyoutModelClose = document.getElementById('flyoutModal');
    flyoutModelClose.click();
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
  flyoutFind(data) {
    data.isRawMaterial = false;
    this.synthesizeService.loading = true;
    this.manageRawMaterialsService.flyoutfind(data).subscribe(res => {
      this.inventoryFlyoutDTO.colsData = res.body.data;
      this.inventoryFlyoutDTO.flyTotalRecords = this.inventoryFlyoutDTO.colsData.length;
      this.notify.showSuccess(res.body.message);
      this.commonService.sendToggleFlagFind(true);
      this.synthesizeService.loading = false;
    }, (error) => {
      this.inventoryFlyoutDTO.flyTotalRecords = 0;
      this.notify.showError(error.message);
      this.synthesizeService.loading = false;
    });
  }
  totalQuantityValueChange(data: any) {
    this.inventoryDTO.totalQuantityUnit = data.id;
  }
  resetFlyoutForm() {
    this.inventoryFlyoutDTO.flyoutForm.reset();
  }
}
