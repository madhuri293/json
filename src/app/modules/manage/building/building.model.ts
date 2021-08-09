import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';



export class Building extends EntityModel {
    locationCode: string;
    locationName: string;
    locationId: string;
    buildingNumber: string;
    status: string;
    sk: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }
}

export class Location extends EntityModel {
    locationCode: string;
    locationName: string;
    locationDescription: string;
    status: string;
    timeZoneName: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}

export class BuildingDTO {
    rows: any = [];
    columns: any = [];
    nOfRecordPage: any;
    totalRecords: any;
    buildingForm: FormGroup;
    loading: boolean;
    statusClass: string;
    numberOfRecords: any;
    locationList: any = [];
    locationListForDataTable: any;
    statusList: any;
    buildingList: any;
    buildingDetail: any;
    locationData: any;
    buildingId: any;
    idToDelete: any;
    privilege: boolean;
    skId: any;
    isDisabled: boolean;
}
