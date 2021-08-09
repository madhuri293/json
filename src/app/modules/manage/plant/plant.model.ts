import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class Plant extends EntityModel {
    code: string;
    locationId: string;
    buildingId: string;
    locationName: string;
    buildingName: string;
    status: string;
    plantTypeStatus: string;
    sk: string;
    technologyId: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}

export class PlantDTO {
  rows: any = [];
  columns: any = [];
  nOfRecordPage: any;
  totalRecords: any;
  plantForm: FormGroup;
  statusClass: string;
  loading: boolean;
  numberOfRecords: any;
  locationList: any;
  buildingNumberList: any;
  isSelected: boolean;
  plantList: any;
  statusList: any;
  isEnable: boolean;
  idToDelete: any;
  technology: any;
  skId: any;
  privilege: boolean;
  isDisable: boolean;
  }






