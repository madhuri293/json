import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class ReportsCharts extends EntityModel {
    chartName: string;
    description: string;
    technologyId: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }
}

export class ChartDTO extends EntityModel {

    chartForm: FormGroup;
    description: string;
    technologyId: string;
    loading: boolean;
    nOfRecordPage: number;
    columns: any;
    rows: any;
    totalRecords: number;
    technologyData: any;
    idToDelete: any;
    skId: any;
    userId: any;
    privilege: boolean;
    isDisabled: boolean;
}
