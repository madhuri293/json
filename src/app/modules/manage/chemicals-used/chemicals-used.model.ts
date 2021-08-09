import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class ManageChemicals extends EntityModel {
  chemicalName: string;
  status: string;
  designation: string;
  stateId: string;
  supplier: string;
  state: string;

}
export class ChemicalsDTO {
  rows: any = [];
  columns: any = [];
  nOfRecordPage: any;
  totalRecords: any;
  numberOfRecords: any;
  manageChemicalsForm: FormGroup;
  loading: boolean;
  manageChemicalsList: any;
  manageChemicals: ManageChemicals = new ManageChemicals();
  chemicalStateList: any;
  idToDelete: any;
  statusList: any;
  privilege: boolean;
  isDisabled: boolean;
}
