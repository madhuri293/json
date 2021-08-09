import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';

export class Caliberation extends EntityModel {
  plantCode: string;
  equipmentName: string;
  fitR2Measurement: string;
  slopeValueMeasurement: string;
  interceptValueMeasurement: string;
  maxValueMeasurement: string;
  minValueMeasurement: string;
  calibrationDateTime: string;
  calibrationFactorName: string;
  plantId: string;
  calibrationFactorId: string;
  controlMinRange: string;
  controlMaxRange: string;
  equipmentId: string;
  status: string;
  sk: string;

  toString(): string {
    throw new Error('Method not implemented.');
  }


}

export class CaliberationDTO {
  cols: any[];
  caliberationForm: FormGroup;
  columns: any[];
  caliberationList: any = [];
  caliberationFactorList: {}[];
  nOfRecordPage: number;
  totalRecords: number;
  loading: boolean;
  statusClass: string;
  caliberationFactorMap = new Map();
  caliberationUpdate: any;
  caliberationDetail: {}[];
  minErrorMsg: any;
  maxErrorMsg: any;
  paramSubscription: Subscription;
  equipmentId: any;
  equipment: any;
  isEnable: boolean;
  plant: any;
  calibrationId: any;
  skId: any;
  formValid: boolean;
  min: any; max: any; minerrormsg: any;
  controlMin: any; controlMax: any; controlMinErrorMsg: any;
  privilege: boolean;
  controlFlag: boolean;
  isDisabled: boolean;
}
