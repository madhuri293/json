import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class Location extends EntityModel {
    code: string;
    locationName: string;
    description: string;
    status: string;
    timeZoneName: string;
    sk: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }
}

export class LocationDTO {
    rows: any = [];
    columns: any = [];
    nOfRecordPage: any;
    totalRecords: any;
    locationForm: FormGroup;
    numberOfRecords: any;
    loading: boolean;
    statusClass: string;
    timeZoneList: { id: string; timeZoneName: string; }[];
    statusList: any;
    isEnable: boolean;
    locationList: any;
    idToDelete: any;
    skId: any;
    privilege: boolean;
    isDisabled: boolean;
}
