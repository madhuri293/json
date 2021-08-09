import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class ReportsPlots extends EntityModel {
    chartName: string;
    description: string;
    technologyId: string;
    plotName: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }
}

export class PlotDTO extends EntityModel {
    technologyName: string;
    plotForm: FormGroup;
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
