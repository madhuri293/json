import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class LimsComponentModel extends EntityModel {
    limsOperationName: string;
    limsComponent: string;
    fdmsComponent: string;
    uomGroupId: string;
    uomUnitName: string;
    uomUnitId: string;
    analysisTypeName: string;
    componentType: string;
    totalRecords: any;
    currentPage: any = 1;
    recordsPerPage: any = 10;
    sortOrder: any;
    sortColumn: string;
    precision: number;
    limsOperationID: any;
    analysisMethodName: string;
    analysisMethodNumber: string;

}


export class UOMNameDetails extends EntityModel {
    unitName: string;

}

export class UOMGroup extends EntityModel {

}
export class StandardCompnentPop extends EntityModel {
    componentType: string;
    componentLabel: string;
    CurrentPage: any = 1;
    RecordsPerPage: any = 10;
    SortColumn: any;
    SortOrder: any;
    TotalRecords: any;

}
export class StandardComponentObject {
    standardComponentPage: any;
    standardComponentnOfRecordPage: any;
    sortColumn: any;
    sortOrder: any;
}
export class LimsDTO {
    analysisTypeName: any;
    idToDelete: any;
    limsForm: FormGroup;
    limsOperationsFlyOutForm: FormGroup;
    standardFlyOutForm: FormGroup;
    columns: any;
    rows: any;
    nOfRecordPage: any;
    limsnOfRecordPage: any;
    numberOfRecords: any;
    totalRecords: any;
    limsList: any;
    standardComponentColumns: any;
    limsOperationColumns: any;
    standardComponentrows: any;
    limsOperationrows: any;
    standardComponentList: boolean;
    limsOperationsList: boolean;
    limsOperationsDataList: any;
    limsOperationsDetail: any;
    limsTotalRecords: any;
    limsOperationnOfRecordPage: any;
    LimsOperationFlyOut: boolean;
    standardComponentFlyOut: boolean;

    standardCompnentDataList: any;
    standardTotalRecords: any;
    standardComponentnOfRecordPage: any;
    standnOfRecordPage: any;
    uomGroupNameList: any;
    groupNameResultSet: any;
    uomNameList: any;
    NewGroup = [];
    uomGroup: any;
    tempLims: [];
    limsListRecord: any = [];
    loadFlyoutFirst: boolean;
    uomGroupNameSelect: any;
    operationNameForReset: any;
    privilege: boolean;
    standardComponentPage: any;
    sortOrder: string;
    sortColumn: string;
    standardComponentObject = new StandardComponentObject();
}


export class AnalysisMethod extends EntityModel {
    currentPage: number;
    recordsPerPage: number;
    sortColumn: string;
    sortOrder: string;
    totalRecords: number;

}


