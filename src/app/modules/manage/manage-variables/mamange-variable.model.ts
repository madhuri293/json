import { FormGroup } from '@angular/forms';
import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';

export class ManageVariable extends EntityModel {
    variableName: string;
    defaultUnit: any;
    precision: any;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}

export class ManageVariableDTO {
    cols: any[];
    variablesData = [];
    precisionList: { id: number; precision: number; }[];
    applicationList: any;
    variableForm: FormGroup;
    templateName: any = 'Default Template';
    templateId: any;
    disableFlag: boolean;
    privilege: boolean;
}
