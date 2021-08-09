import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';

export class CatalystFamily extends EntityModel {
    commercialFamilyName: string;
    familyInd: string;
    programFamilyName: string;
    catalystApplicationId: string;
    catalystApplicationName: string;
    catalystTypeId: string;
    catalystTypeName: string;
    pieceDensityArMax: number;
    pieceDensityArMin: number;
    loiMin: number;
    loiMax: number;
    sulfurMin: number;
    sulfurMax: number;
    sdsNum: string;
    status: string;
    itemType: string;
    sk: string;
}

export class CatalystFamilyDTO {
    catalystFamilyForm: FormGroup;
    loading: boolean;
    nOfRecordPage: number;
    totalRecords: number;
    catalystFamilyList: any;
    columns: any;
    rows: any;
    numberOfRecords: number;
    isCommercial: boolean;
    isProgram: boolean;
    isRadio2: boolean;
    isRadio1: boolean;
    catalystTypeList: any;
    applicationDetailsList: any;
    formValid: boolean;
    uomFlag: boolean;
    idToDelete: any;
    statusList: any;
    privilege: boolean;
    isReset: any;
    radioFlag: boolean;
    selectType:any;
    isEdit:any;
    isDisabled:boolean;
    isSave:boolean;
}


