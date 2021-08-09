import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class CatalystScale extends EntityModel {
    catalystScaleName: string;
    catalystScaleDescription: string;
    status: string;
    description: string;
    scaleName: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}

export class CatalystScaleDTO {
    catalystScaleForm: FormGroup;
    columns: any;
    rows: any;
    nOfRecordPage: any;
    loading: boolean;
    numberOfRecords: any;
    totalRecords: any;
    catalystScaleList: any;
    isEnable: boolean;
    idToDelete: any;
    skId: any;
    statusList: any;
    isDisabled: boolean;
    privilege: any;
}






