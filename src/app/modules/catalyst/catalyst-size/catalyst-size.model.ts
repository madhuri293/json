import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class CatalystSize extends EntityModel {
    catalystSizeCode: string;
    status: string;
    sizeCode: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}

export class CatalystSizeDTO {
  catalystSizeForm: FormGroup;
  loading: boolean;
  nOfRecordPage: number;
  totalRecords: number;
  catalystSizeList: any;
  columns: any;
  rows: any;
  numberOfRecords: number;
  isEnable: boolean;
  idToDelete: any;
  statusList: any;
  isDisabled: boolean;
  privilege: boolean;
}






