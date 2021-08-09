import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';

export class CatalystAlias extends EntityModel {
    catalystAliasName: string;
    catalystShapeId: string;
    catalystSizeId: string;
    crushedFractionMsr: string;
    status: string;
    aliasName: string;
    shapeId: string;
    sizeId: string;

}

export class CatalystAliasDTO {
    catalystAliasForm: FormGroup;
    loading: boolean;
    nOfRecordPage: number;
    totalRecords: number;
    catalystAliasList: any;
    columns: any;
    rows: any;
    numberOfRecords: number;
    catalystSizeList: any;
    catalystShapeList: any;
    isEnable: boolean;
    idToDelete: any;
    skId: any;
    statusList: any;
    privilege: boolean;
    isDisabled: boolean;
}
