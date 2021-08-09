import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';

export class Equipment extends EntityModel {

  plantId: string;
  equipmentName: string;
  vesselTypeId: string;
  calculationModuleId: string;
  vcfTypeId: string;
  status: string;
  sk: string;
  technologyId: string;

}

export class EquipmentDTO {
  cols: any[];
  equipmentList: any[];
  numberOfRecords: number;
  equipmentForm: FormGroup;
  statusClass: string;
  rows: any;
  totalRecords: any;
  plantCodedrop: any[] = [];
  equipmenttableData: any;
  statusList: any;
  equipmentcalculation: any;
  equipmentVcf: any;
  cars: { label: string; value: string; }[];
  equipmentType: any;
  isEnable: boolean;
  nOfRecordPage: any;
  idToDelete: any;
  skId: any;
  privilege: boolean;
  isDisabled: boolean;
  technology:any;
}
