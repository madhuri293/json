import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';

export class StandardCutRangeBP extends EntityModel {
    technologyId: any;
    objectiveName: any;
    toString(): string {
        throw new Error('Method not implemented.');
    }
}


export class StandardCutRangeDTO {
    rows: any = [];
    columns: any = [];
    nOfRecordPage: any;
    totalRecords: any;
    numberOfRecords: any;
    nOfFlyRecordPage: any = 10;
    flyTotalRecords: any;
    cols: any[];
    colsData: any[];
    isTableData: boolean;
    standardCutRangeForm: FormGroup;
    runObjectiveForm: FormGroup;
    runObjectiveName: any;
    runObjectiveId: any;
    currState: boolean;
    cars: any[];
    originalGridData: any[];
    displayCars: any = [];
    selectedIndex: any;
    showError: boolean;
    technology: any;
    runObjectiveList: any;
    runObjectiveRecords: any;
    errorIndex: any;
    isUpdate: boolean;
    loading: boolean;
   isValidDecimal:boolean;

    tempUnits: any;
    uomObj: any;
    units: any = [];
    uomObjList: any;
    defaultUnit: any;
    variableCategory: any = 'Run - Boiling Points';
    variableName: any = 'Boiling Points Unit';
    baseValue: any;
    displayValue: any;
    displayValueIP: any;
    displayValueEP: any;
    displayValueCars: any = [];
    gridData:any =[];
    privilege: boolean;
}

// tslint:disable-next-line:class-name
export class flyOutFormDTO {
    objectiveName: any;

}
