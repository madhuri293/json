import { FormGroup } from '@angular/forms';
import { EntityModel } from '../../core/services/abstract-rest/abstract-rest.service';


export class Report extends EntityModel {
    description: string;
    reportName: string;
    sk: string;
    reportCheck: any;

    toString(): string {
        throw new Error('Method not implemented.');
    }


   
}

export class ReportDTO {
    cols: any;
    usersTempList: any[];
    usersList: any[];
    userBeforeEdit: any;
    columns: any[];
    reportForm: FormGroup;
  loading: boolean;
  nOfRecordPage: number;
  allRoles: any;
  totalRecords: any;
  numberOfRecords: any;

}