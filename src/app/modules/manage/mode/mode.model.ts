import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class Mode extends EntityModel {
    application: string;
    modeHash: string;
    modeNumber: string;
    controlMethodId: string;
    sulfindingId: string;
    psig: string;
    hr1: string;
    scfb: string;
    condition: any;
    description: string;
    technologyId: string;
    lhsv: string;
    pressure: string;
    modeDescription: string;
    objectiveId: string;
    toString(): string {
        throw new Error('Method not implemented.');

    }
}

export class ModeDTO {
    modeForm: FormGroup;
    rows: any = [];
    columns: any = [];
    nOfRecordPage: any;
    totalRecords: any;
    numberOfRecords: any;
    modeList: any;
    modeDataList: any;
    sulfidingDataList: any;
    controlDataList: any;
    modeDataRecord: any;
    idToDelete: any;
    technology: any;
    modeGridDataList: any;
    skId: any;
    ModeValue: string;
    sulfidingValue: string;
    controlValue: string;
    pressureVal: any;
    controlVal: any;
    sulfidingVal: any;
    ddPressure: string;
    ddControl: string;
    ddsulfiding: string;
    uomFlag: boolean;
    formValid: boolean;
    isDisabled: boolean;
    privilege: boolean;
    isReset: any = 'reset';
  uomDirty: boolean;
  uomInput: boolean;
}




