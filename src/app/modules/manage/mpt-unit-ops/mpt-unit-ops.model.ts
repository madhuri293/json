import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class MptUnitOps extends EntityModel {
    technology: any;
    technologyId: any;

    toString(): string {
        throw new Error('Method not implemented.');
    }

}
export class saveObj extends EntityModel {
    sk: any;
    itemType: any;
    data: any;
    unitOperationName: any;
    isChecked: any;
}

export class MptUnitOpsDTO {
    mptUnitsForm: FormGroup;
    operationsList: any = [];
    activeOperationsList: any;
    privilege: boolean;
    loading:boolean;
    operationsCheckList:any;

}

