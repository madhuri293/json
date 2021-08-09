import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';

export class CatalystType extends EntityModel {
    typeName: string;
    description: string;
    status: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}

export class CatalystTypeDTO {
    catalystTypeForm: FormGroup;
    loading: boolean;
    nOfRecordPage: number;
    totalRecords: number;
    catalystTypeList: any;
    columns: any;
    rows: any;
    numberOfRecords: number;
    isEnable: boolean;
    idToDelete: any;
    statusList: any;
    isDisabled: boolean;
    privilege: boolean;
}
