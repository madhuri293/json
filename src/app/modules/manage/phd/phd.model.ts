import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';

export class Phd extends EntityModel {
    displayOrder: number;
    minRange: any;
    maxRange: any;
    data: string;
    itemType: string;
    logReadingLabel: string;
    phdTagName: string;
    phdTypeId: string;
    plantId: string;
    sk: string;
    sLogReadingLabel: string;
    sphdTagName: string;
    technologyId: string;
    retransmitCat: string;
    calcAlias: string;


}
export class PhdDTO {
    PHDform: FormGroup;
    rows: any = [];
    columns: any = [];
    nOfRecordPage: any;
    totalRecords: any;
    numberOfRecords: any;
    phdTag: any;
    technology: any;
    phdList: any;
    phdTypeList: any;
    plantId: any;
    phdId: any;
    phdDetails: any;
    isDisabled: boolean;
    privilege: boolean;
  plantName: any;
  plantCode: any;
}
export class PhdPlantFlyoutDTO {
    plantFlyOutForm: FormGroup;
    nOfFlyRecordPage: any;
    flyTotalRecords: any;
    cols: any[];
    colsData: any[];
    rows: any;
    plantList: any;
}


