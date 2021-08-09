import { EntityModel } from '../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup, FormArray } from '@angular/forms';

export class Inventory extends EntityModel {
    designation: any;
    inventoryInfo: any[];
    totalQuantity: number;
    catalystId: string;
    totalQtyUOMId: string;
    catalystName: string;
    catalystInventoryDetails: any[] = [];
    id: string;
    itemType: string;
    sk: string;
    data: string;
    netQuantity: number;
    materialId: string;
    materialName: string;
    rawMaterialInventoryDetails: any[] = [];
    synthesizedMaterialInventoryDetails: any[] = [];
    displayOrderNumber: any;

}

export class InventoryInfo {
    container: any;
    book: string;
    location: string;
    site: string;
    netQuantity: number;
    inventoryId: string;
    qtyUOMId: string;
    id: string;
    itemType: string;
    sk: string;
    data: string;
}

export class InventoryDTO {
    unitIdArray: any = [];
    rows: any = [];
    columns: any = [];
    nOfRecordPage: any;
    totalRecords: any;
    numberOfRecordsPerPage: any;
    inventory = new Inventory();
    inventoryForm: FormGroup;
    route: string;
    title: string;
    inventoryList: any[];
    inventoryRecords: any[];
    inventoryFormArray: FormArray;
    catalystInventoryDetails: FormArray;
    synthesizedMaterialInventoryDetails: FormArray;
    rawMaterialInventoryDetails: FormArray;
    synthesizedMaterialNameList: any;
    catalystInventoryNameList: any;
    labelName: string;
    inventoryField: boolean;
    catlystInventoryField: boolean;
    syntheticMaterialName: boolean;
    materialNameList: any;
    rawMaterialInventoryList = [];
    inventoryId: string;
    privilage: any;
    privilageOption: any;
    enableEdit: any;
    mainMasterList: any;
    netQuantityArray = new Array();
    totalQuantity: number;
    technologyList: any;
    desigNamtionId: any;
    quantityArray = new Array();
    isDisabled = false;
    totalQuantityUnit: any;
    privilege: boolean;
    isReset: any = 'reset';
    resetUOM = 'inventoryReset';
  defaultUnit: any;
  enableFind: boolean;
  reloadQuantity: boolean;
}

export class InventoryFlyoutDTO {
    designationFlyout: boolean;
    flyoutForm: FormGroup;
    nOfFlyRecordPage: any;
    flyTotalRecords: any;
    colsData: any[];
    cols: any[];
    mainMasterList: any;
}

