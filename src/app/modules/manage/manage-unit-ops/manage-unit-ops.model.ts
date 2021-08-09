import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class ManageUnitOps extends EntityModel {
    unitOperationName: string;
    description: string;
    status: string;
    id: string;
    itemType: string;
    sk: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}



export class ManageUnitOpsDTO {
  rows: any = [];
  columns: any = [];
  nOfRecordPage: any;
  totalRecords: any;
  numberOfRecords: any;
  unitOps: any;
  manageUnitOpsForm: FormGroup;
  loading: boolean;
  manageUnitOpsList: any;
  idToDelete: any;
  skId: any;
  statusList: any;
  isDisabled: boolean;
  privilege: boolean;
  }
