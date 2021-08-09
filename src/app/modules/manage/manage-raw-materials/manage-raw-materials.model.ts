import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class ManageRawMaterials extends EntityModel {
  stateId: string;
  materialName: string;
  status: string;
  id: string;
  designation: string;
  isRawMaterial = false;
  materialType: string;
}

export class ManageRawMaterialsDTO {
  statusList: any;
  rows: any = [];
  columns: any = [];
  nOfRecordPage: any;
  totalRecords: any;
  numberOfRecords: any;
  rawMaterial: any;
  manageRawMaterialsForm: FormGroup;
  loading: boolean;
  manageRawMaterialsList: any;
  rawMaterialStateList: any;
  privilege: boolean;
  isDisabled: boolean;
}
