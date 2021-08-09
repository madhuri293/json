import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';
export class LimsAnalysisModel extends EntityModel {
    methodName: string;
    methodNumber: string;
    limsOperation: string;
    checkedSources: any[] = [];
    methodDescription: string;
    id: any;
    uomGroup: any = {};
    SourceId: string;
    currentPage: number;
    recordsPerPage: number;
    sortColumn: string;
    sortOrder: string;
    totalRecords: number;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}


export class AnalysisMethod extends EntityModel {
    currentPage: number;
    recordsPerPage: number;
    sortColumn: string;
    sortOrder: string;
    totalRecords: number;

}
export class Sources extends EntityModel {

    name: string;
    isUsed: boolean;
    toString(): string {
        throw new Error('Method not implemented.');
    }
}

export class LimsAnalysisDTO extends EntityModel {
    MethodNameResult: any;
    uomgroupName: any[] = [];
    checkedSources: any;
    idToDelete: any;
    sk: any;
    limsAnalysisForm: FormGroup;
    constData: any;
    columns: any;
    rows: any;
    loading: boolean;
    totalRecords: any;
    numberOfRecords: any;
    limsAnalysisList: any;
    limsAnalysis: any;
    nOfRecordPage: any;
    selectedCars2: string[] = [];
    uomGroupNameList: any;
    sourceNameList: any;
    errorMessage: string;
    resultSourceNameTemp: any[];
    resultSourceName: any = [];
    sourceNameObj: any;
    resultSourceName1: any[];
    disableSave: boolean;
    tempList: any;
    SourceId: any;
  privilege: any;
}

