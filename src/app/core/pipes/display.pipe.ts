import { Pipe, PipeTransform } from '@angular/core';
import { UnitSelectorNames } from './../../shared/enum/enum.model';

@Pipe({
  name: 'display'
})
export class DisplayPipe implements PipeTransform {


  private defaultUnit: any;
  private displayValue: any;
  private precision: number;
  baseValue: number;

  transform(value: any, uom: any) {
    this.displayValue = value;
    this.defaultUnit = uom;
    if (uom && !isNaN(parseFloat(value))) {
      this.precision = !isNaN(parseInt(uom.variableDecimalPoint)) ? uom.variableDecimalPoint : this.precision;
      if (this.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME5) {
        this.displayValue = (Number(this.defaultUnit.slopeValueCs) / value) - Number(this.defaultUnit.interceptValueCs);
      } else {

        this.displayValue = (value - Number(this.defaultUnit.interceptValueCs)) / Number(this.defaultUnit.slopeValueCs);
      }
      this.displayValue = parseFloat(this.displayValue).toFixed(this.GetPrecison());
      this.displayValue = isNaN(this.displayValue) ? '' : this.displayValue;
    }
    return this.displayValue;


  }

  GetPrecison() {
    if (this.defaultUnit.variableDecimalPoint != null) {
      return this.defaultUnit.variableDecimalPoint;
    } else {
      return !isNaN(this.precision) ? this.precision : 6;
    }
  }

}
