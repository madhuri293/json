import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';



export class ManageRecipe extends EntityModel {
    technologyId: string;
    plantId: string;
    tagCode: string;
    tagName: string;
    uomId: string;
    sk: string;
    tagMinValue: string;
    tagMaxValue: string;
    energized: string;
    id: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }

}
export class ManageRecipeDTO {
    rows: any = [];
    columns: any = [];
    nOfRecordPage: any;
    totalRecords: any;
    numberOfRecords: any;
    manageRecipeForm: FormGroup;
    loading: boolean;
    manageRecipeList: any;
    manageTechnologyList: any;
    managePlantList: any;
    skId: any;
    manageRecipeUOMList: any;
    idToDelete: any;
    formValid: boolean;
    isEnable: boolean;
    min: any; max: any; minerrormsg: any;
    isDisabled: boolean;
  privilege: boolean;
  }
