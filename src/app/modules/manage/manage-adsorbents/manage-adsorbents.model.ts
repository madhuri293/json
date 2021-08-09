import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class ManageAdsorbents extends EntityModel {
    productName: string;
    productType: string;
    productSubType: string;
    productUop: string;
    book: string;
    productLot: string;
    sampleDescription: string;
    sampleType: string;
    binderType: string;
    normalSize: string;
    shape: string;
    comments: string;
    productH: string;
    productF: string;
    productR: string;
    productColor: string;
    adsorbentCondition: string;
    bulkDensity: string;
    meanParticleDiameter: string;
    position: string;
    limsSampleNumber: string;
    lims: string;
    id: string;
    status: string;
    notePart1: string;
    notePart2: string;
    notePart3: string;
    limsSampleId: string;
    productId: any;
    productTypeId: string;
    productSubTypeId: string;
    uop: any;
    lot: any;
    sampleTypeId: any;
    binderTypeId: any;
    sizeId: any;
    shapeId: any;
    hzrdNum: any;
    flameNum: any;
    reactNum: any;
    color: any;
    conditionId: any;
    meanPracticalDiameter: any;
    technologyId: any;
    notebook: any;
    bulkDensityUOMId: any;
    meanPracticalDiameterUOMId: any;

    toString(): string {
        throw new Error('Method not implemented.');
    }

}
export class ProductName extends EntityModel {
    productName: string;
    productTypeName: string;
    productSubTypeName: string;
    status: string;
    productTypeId: string;
    productSubTypeId: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }
}
export class ManageAdsorbentDTO {
    manageAdsorbentForm: FormGroup;
    adsorbentForm: FormGroup;
    rows: any = [];
    columns: any = [];
    nOfRecordPage: any;
    totalRecords: any;
    numberOfRecords: any;
    nOfFlyRecordPage: any;
    flyTotalRecords: any;
    cols: any[];
    colsData: any[];
    manageAdsorbentList: any;
    loading: boolean;
    techId: any;
    typeList: any;
    subTypeList: any;
    sampleTypeList: any;
    binderTypeList: any;
    conditionTypeList: any;
    rTypeList: any;
    fTypeList: any;
    hTypeList: any;
    shapeTypeList: any;
    sizeTypeList: any;
    flyOutPopUp: boolean;
    totalRecords1: number;
    productDataList: any;
    isDisabled: boolean;
    privilege: boolean;
    uopNoteLotFlg: any;
    technology: any;
    uomInput: boolean;
    uomDirty: boolean;
}






