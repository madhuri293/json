import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';

export class Reactors extends EntityModel {
    internalDiameter: any;
    bedLength: string;
    bedVolume: string;
    catalystLoadingTemplateId: string;
    itemType: string;
    sk: string;
    data: string;
}

export class CatalystLoading extends EntityModel {
    status: string;
    beds: Bed[] = [];
    reactors: Reactors = new Reactors();
    technologyId: any;
    templateName: string;
}



export class Bed extends EntityModel {
    bedNumber: number;
    catalystLoadingTemplateId: string;
    volume: any;
    diluentVolume: any;
    diluentId: string;
    split: string;
    itemType: string;
    sk: string;
    data: string;
}

export class Status extends EntityModel {
}
export class CatalystLoadingDTO {
    errorIndex:any;
    isError:boolean;
    idToDelete: any;
    technologyList: any;
    bed: Bed = new Bed();
    IbedsData = [];
    catalystForm: FormGroup;
    catalystList: any;
    catalystdiluents: any;
    cols: any[];
    colsdiluents: any[];
    numberOfRecords: number;
    diluentnOfRecords: number;
    nOfRecordPage: any;
    diluentnOfRecordPage: any;
    totalRecords: number;
    diluenttotalRecords: number;
    catalysDetail: any;
    diluentsDetail: any;
    customize: any;
    reactorBedLength: any;
    totalVolume: any;
    statusList: any;
    diluentlist: any;
    flag: boolean;
    customizeflag: boolean;
    diluentIndex: number;
    arraylist: any[];
    validForm: boolean = true;
    uomtemplate: boolean;
    statuSelection: boolean;
    formValid: boolean;
    diluentForm: FormGroup;
    privilege: boolean;
    isReset: any = 'reset';
    formValidForFind: boolean;
    isDisabled: boolean;
    errorMessage:any;
}

