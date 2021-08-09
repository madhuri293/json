import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';
import { StatusEnum } from '../../../shared/enum/enum.model';


export class UnitOfMeasuremnet extends EntityModel {
    unitName: string;
    groupId: string;
    groupName: string;
    unitDisplayName: string;
    baseUnitStatus: string;
    defaultUnitStatus: string;
    slopeValueCs: any;
    interceptValueCs: string;
    variableDecimalPoint: any;
    isDefaultUOM: any;
    id: string;
    itemType: string;
    sk: string;
}


export class Group {
    id: any;
    groupName: any;
}
export class UnitOfMeasurementtDTO {
    isDisable: boolean;
    measurementValues: any;
    cols: any[];
    totalRecords: any;
    measurementForm: FormGroup;
    unitOfMeasurement = new UnitOfMeasuremnet();
    baseUnitIndicator = [{ id: StatusEnum.Y, name: StatusEnum.YES}, { id: StatusEnum.N, name: StatusEnum.NO }];
    uomGroupNameList: any;
    numberOfRecords: any;
    nOfRecordPage: any;
    measurementDetail: any;
    measurementId: any;
    privilege: boolean;
}
