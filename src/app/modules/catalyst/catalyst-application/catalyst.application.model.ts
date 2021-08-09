import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';

export class CatalystApplication extends EntityModel {
  applicationName: string;
  description: string;
  typeId: string;
  status: string;
  typeName: string;
  itemType: string;
  sk: string;
  data: string;
}

export class CatalystApplicationDTO {
  catalystApplicationForm: FormGroup;

  catalystTypeList: any;
  catalystApplicationList: any;
  totalRecords: any;
  nOfRecords: number;
  columns: any;
  applicationId: any;
  sk: any;
  statusList: any;
  privilege: boolean;
}
