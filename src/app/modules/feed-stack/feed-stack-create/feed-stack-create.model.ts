import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class Customer extends EntityModel {
    name: string;
    city: string;
    country: string;
    customerId: string;
    customerLocationId: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}
export class FeedType extends EntityModel {
    toString(): string {
        throw new Error('Method not implemented.');
    }
}
export class Category extends EntityModel {
    toString(): string {
        throw new Error('Method not implemented.');
    }
}
export class SubCategory extends EntityModel {
    toString(): string {
        throw new Error('Method not implemented.');
    }
}

export class CreateFeed extends EntityModel {


    uopNumber: string;
    bookNumber: string;
    sfdcNumber: string;
    feedType: string;
    fbp: number;
    ibp: number;
    status: string;
    statusId: string;
    customerData: string;
    description: string;
    feedName: string;
    subCategoryId: string;
    categoryId: string;
    country: string;
    city: string;
    custName: string;
    id: string;
    sk: string;
    customerId: string;
    customerLocationId: string;
    customerName: string;
    technologyId: string;

    toString(): string {
        throw new Error('Method not implemented.');
    }
}


export class FeedStackDTO {
    isDisable: boolean;
    cols: any[];
    rows: any[];
    creatFeedForm: FormGroup;
    creatFeedPopUpForm: FormGroup;
    numberOfRecords: number;
    showtable: boolean;
    nOfRecordPage: number;
    customernOfRecordPage: number;
    totalRecords1: number;
    custTotalRecords: number;
    feedStackDataList: any;
    totalRecords: number;
    colsData: any[];
    feedCreateRecord: any;
    flyFeedCreateRecord: any;
    feedCreateDataSet: any;
    feedTypeData: any;
    categoryTypeData: any;
    subCatRecords: any;
    customerDataList: any;
    numberOfRecords1: any;
    technologyData: any;
    customerDetail: any;
    flyOutPopUp: boolean;
    formValid: boolean;
    feedStackData: any[];
    uomFlag: boolean;
    idToDelete: any;
    statusList: any;
  privilege: boolean;
  

}
