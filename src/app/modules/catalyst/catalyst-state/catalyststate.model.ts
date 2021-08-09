import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class CatalystState extends EntityModel {
  stateName: string;
  sulfidingStatus: string;
  status: string;
  sk: string;
  toString(): string {
    throw new Error('Method not implemented.');
  }

}

export class CatalystStateDTO {
  cols: any[];
  rows: any = [];
  catalystForm: FormGroup;
  catalystData: any;
  catalystStateList: any;
  sulfidingIndicatorList: any;
  nOfRecordPage: any;
  totalRecords: any;
  numberOfRecords: any;
  loading: boolean;
  isEnable: boolean;
  isSave: boolean;
  idToDelete: any;
  statusList: any;
  privilege: boolean;
}


