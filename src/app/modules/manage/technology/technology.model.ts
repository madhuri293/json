import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';





export class Technology extends EntityModel {
    colorCode: string;
    description: string;
    status: string;
    technologyCode: string;
    technologyName: string;
    sk: string;
}

export class TechnologyDTO  {
    colsData: any[];
    rowsdata: any[];
    technologyList: any[];
    totalRecords: any;
    technologies: any;
    technology = new Technology();
    technologyForm: FormGroup;
    disableFindButton = true;
    statusList:any;
    technologyDetail: any;
    nOfRecordPage: number;
    confirmationresult: boolean;
    techId: any;
    skId: any;
    privilege: any;
    isDisabled: boolean;
}


