import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class CatalystShape extends EntityModel {
    catalystShapeName: string;
    assumedVoidFractionMsr: string;
    crushedFractionMsr: string;
    status: string;
    shapeName: string;
    assumedVoidFraction: string;
    crushedFraction: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}

export class CatalystShapeDTO {
  columns: any;
  rows: any;
  nOfRecordPage: any;
  loading: boolean;
  numberOfRecords: any;
  totalRecords: any;
  catalystShapeList: any;
  catalystShape: any;
  isError: boolean;
  isErrorFraction: boolean;
  isEnable: boolean;
  catalystShapeForm: FormGroup;
  idToDelete: any;
  skId: number;
  statusList: any;
  isDisabled: boolean;
  privilege: boolean;
}






