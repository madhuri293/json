import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';

export class Diluent extends EntityModel {
    sourceName: string;
    status: string;
    diluentName: string;
    abdvf: number;
    description: string;
    pdvf: number;
    sizeId: string;
    diluentInd: string;
    sizeCode: string;
    catalystSizeId: string;
    itemType: string;
    sk: string;
    data: string;
    diluentSizeId: string;

}

export class DiluentDTO {
    diluentForm: FormGroup;
    diluentList: any;
    cols: any[];
    numberOfRecords: number;
    nOfRecordPage: any;
    totalRecords: number;
    diluentDetail: any;
    columns: any;
    rows: any;
    sizeDataList: any;
    diluentDataList: any;
    loading: boolean;
    formValid: boolean;
    uomFlag: boolean;
    idToDelete: any;
    statusList: any;
    indicatorList: any;
    privilege: boolean;
    isReset: any = 'reset';
}
