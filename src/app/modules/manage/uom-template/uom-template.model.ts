import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class UomTemplate extends EntityModel {
    technologyId: string;
    templateName: string;
    userId: string;
    isSystemTemplate: string;
    defaultTemplateId: string;
    id: string;
    itemType: string;
    sk: string;
    data: string;
}

export class UserTemplate extends EntityModel {
    userId: any;
    uomTemplateId: any;
}


export class UomTemplateDTO {
    uomTemplateList: any;
    colsData: any;
    totalRecords: number;
    uomForm: FormGroup;
    applicationList: any;
    nOfRecordPage: any;
    uomTemplateDetails: any;
    uomTepmlateId: any;
  privilege: boolean;
  isDisable: boolean;
  }

  
