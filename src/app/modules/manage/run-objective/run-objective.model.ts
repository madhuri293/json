import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';
export class RunObjective extends EntityModel {
    technologyName: any;
    processName: any;
    objectiveName: any;
    technologyId: any;
    processId: any;
    sk: any;
    toString(): string {
        throw new Error('');
    }

}


export class RunObjectiveDTO  {
    columns: any[];
    rows: any[];
    nOfRecordPage: any = 10;
    totalRecords: any;
    runObjectiveForm: FormGroup;
  technology: any;
  loading: boolean;
  runObjectiveList: any;
  runObjectiveRecords: any;
  numberOfRecords: number;
  processList: any;
  skToDelete: any;
  idToDelete: any;
  isDisabled: boolean;
  privilege: boolean;
}

