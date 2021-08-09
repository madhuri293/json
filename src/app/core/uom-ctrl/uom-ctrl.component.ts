import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ManageVariableService } from '../../modules/manage/manage-variables/manage-variable.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnitSelectorNames, UomCategory, ErrorMessage } from './../../shared/enum/enum.model';
import { CommonService } from '../../shared/common-services/common.service';

@Component({
  selector: 'app-uom-ctrl',
  templateUrl: './uom-ctrl.component.html'
})
export class UomCtrlComponent implements OnInit, OnDestroy {
  uomForm: FormGroup;
  error: any;
  defaultUnit: any;
  baseValue: any;
  baseValue1: any = {
  };
  baseValue2: any = {
  };
  subscription: any;
  readonly: any;
  category: any;
  displayValue: any;
  displayValue1: any;
  displayValue2: any;
  tempUnits: any = [];
  units: any = [];
  uomObjList: any = [];
  uomObj: any = [];
  @Input() variableName: string;

  @Input() variableCategory: string;
  @Input() unitItems: any;
  @Input() pHolder: any;
  @Input() uomCtrl: any;
  @Input() feedData: any;
  hideElements = false;
  @Input() resetUnit: any;

  @Input()
  set basevalue(bv: any) {
    this.baseValue = bv;

    this.updateDisplayValue();
  }
  @Input()
  set basevalue1(bv: any) {

    if (this.pHolder === UomCategory.IBP) {
      this.baseValue1.value = bv;
      this.baseValue1.name = UomCategory.IBP;
      this.updateDisplayValue1();

    } else if (this.pHolder === UomCategory.FBP) {
      this.baseValue2.value = bv;
      this.baseValue2.name = UomCategory.FBP;
      this.updateDisplayValue1();
    } else if (this.pHolder === UomCategory.ROWEDIT) {
      this.baseValue1.value = bv.ibp;
      this.baseValue1.name = UomCategory.IBP;
      this.baseValue2.value = bv.fbp;
      this.baseValue2.name = UomCategory.FBP;
      this.updateDisplayValue1();
    } else if (this.pHolder === UomCategory.RESET) {
      this.baseValue1.value = NaN;
      this.baseValue1.name = UomCategory.IBP;
      this.baseValue2.value = NaN;
      this.baseValue2.name = UomCategory.FBP;
      this.updateDisplayValue1();
    }
  }
  @Input()
  set basevalue2(bv: any) {
    this.baseValue2 = bv;
    this.updateDisplayValue1();
  }
  @Input()
  get defaultunit() {
    return this.defaultUnit;
  }

  set defaultunit(val) {
    this.defaultUnit = val;
    if (this.uomObj && this.uomObj.variableDecimalPoint) {
      this.defaultUnit.variableDecimalPoint = this.uomObj.variableDecimalPoint;
    }
    this.defaultunitChange.emit(this.defaultUnit);
  }

  @Input()
  get defaultunit1() {
    return this.defaultUnit;
  }

  set defaultunit1(val) {
    this.defaultUnit = val;
    if (this.uomObj && this.uomObj.variableDecimalPoint) {
      this.defaultUnit.variableDecimalPoint = this.uomObj.variableDecimalPoint;
    }
    this.defaultunitChange1.emit(this.defaultUnit);
  }

  @Input()
  get defaultunit2() {
    return this.defaultUnit;
  }

  set defaultunit2(val) {
    this.defaultUnit = val;
    if (this.uomObj && this.uomObj.variableDecimalPoint) {
      this.defaultUnit.variableDecimalPoint = this.uomObj.variableDecimalPoint;
    }
    this.defaultunitChange2.emit(this.defaultUnit);
  }
  @Input()
  get defaultunit3() {
    return this.defaultUnit;
  }

  set defaultunit3(val) {
    this.defaultUnit = val;
    if (this.uomObj && this.uomObj.variableDecimalPoint) {
      this.defaultUnit.variableDecimalPoint = this.uomObj.variableDecimalPoint;
    }
    this.defaultunitChange3.emit(this.defaultUnit);
  }
  @Output()
  baseValueChange = new EventEmitter<number>();
  @Output()
  fbpbaseValue = new EventEmitter<number>();

  @Output()
  newbaseValueChange = new EventEmitter<number>();
  @Output()
  uomInstanceChange = new EventEmitter<any>();
  @Output()
  display = new EventEmitter<number>();
  @Output()
  loadUnits = new EventEmitter<number>();

  @Output() defaultunitChange = new EventEmitter();
  @Output() defaultunitChange1 = new EventEmitter();
  @Output() defaultunitChange2 = new EventEmitter();
  @Output() defaultunitChange3 = new EventEmitter();


  constructor(private manageVariableService: ManageVariableService, private formBuilder: FormBuilder, private commonservice: CommonService) {
  }



  ngOnInit() {
    this.error = ErrorMessage.ERROR;
    this.category = UomCategory.IBP;
    if (this.variableName === UomCategory.IBP) {
      this.feedData = true;
    }
    if (this.variableName === 'ctable') {
      this.feedData = 'false';
      this.uomCtrl = 'false';
      this.variableName = 'IBP';
    }
    if (this.pHolder === UnitSelectorNames.INTERNALDIAMETER || this.pHolder === UnitSelectorNames.BEDLENGTH || this.pHolder === UnitSelectorNames.BEDVOLUME ||
      this.pHolder === UnitSelectorNames.TOTALQUANTITY) {
      this.readonly = true;
    }

    if (this.pHolder === UnitSelectorNames.NETQUANTITY || this.pHolder === UnitSelectorNames.TOTALQUANTITY) {
      this.hideElements = true;
    }

    this.setUnits();



    this.subscription = this.commonservice.sendFlag.subscribe(res => {
      if (res) {
        this.setUnits();

      }
    });
  }


  updateBaseValue() {
    if (!isNaN(parseFloat(this.displayValue))) {
      if (this.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME < '5') {
        this.baseValue = Number(this.defaultUnit.slopeValueCs) / (this.displayValue + Number(this.defaultUnit.interceptValueCs));
      } else {
        this.baseValue = this.displayValue * Number(this.defaultUnit.slopeValueCs) + Number(this.defaultUnit.interceptValueCs);
      }
      this.baseValueChange.emit(this.baseValue);

      this.displayValue = Number(this.displayValue).toFixed(this.GetPrecison());
      this.displayValue = isNaN(this.displayValue) ? '' : this.displayValue;
      this.emitUomObj();
    } else if (this.displayValue === '' || this.displayValue === null || this.displayValue === undefined) {
      this.baseValue = null;
      this.baseValueChange.emit(this.baseValue);
      this.emitUomObj();
    }
  }


  updateBaseValue1() {
    this.category = UomCategory.IBP;
    if (!isNaN(parseFloat(this.displayValue1))) {
      if (this.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME5) {


        this.baseValue1.value = Number(this.defaultUnit.slopeValueCs) / (this.displayValue1 + Number(this.defaultUnit.interceptValueCs));
        this.baseValue1.name = UomCategory.IBP;
      } else {


        this.baseValue1.value = this.displayValue1 * Number(this.defaultUnit.slopeValueCs) + Number(this.defaultUnit.interceptValueCs);
        this.baseValue1.name = UomCategory.IBP;
      }
      this.newbaseValueChange.emit(this.baseValue1);

      this.displayValue1 = this.displayValue1.toFixed(this.GetPrecison());
      this.displayValue1 = isNaN(this.displayValue1) ? '' : this.displayValue1;
      this.emitUomObj();
    } else if (this.displayValue1 === '' || this.displayValue1 === null || this.displayValue1 === undefined) {

      this.baseValue1.value = null;
      this.baseValue1.name = UomCategory.IBP;
      this.newbaseValueChange.emit(this.baseValue1);
      this.emitUomObj();
    }
  }


  updateDisplayValue1() {

    if (this.variableCategory && this.variableName && this.defaultUnit && !isNaN(this.baseValue1.value) && this.baseValue1.value !== null
      && this.baseValue1.value !== '') {
      if (this.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME5) {
        this.displayValue1 = (Number(this.defaultUnit.slopeValueCs) / this.baseValue1.value) - Number(this.defaultUnit.interceptValueCs);

      } else {
        this.displayValue1 = (Number(this.baseValue1.value) - Number(this.defaultUnit.interceptValueCs)) / Number(this.defaultUnit.slopeValueCs);



      }
      this.displayValue1 = parseFloat(this.displayValue1).toFixed(this.GetPrecison());
      this.displayValue1 = isNaN(this.displayValue1) ? '' : this.displayValue1;

      this.emitUomObj();
    } else {
      this.displayValue1 = null;
    }
    this.display.emit(this.displayValue1);
    if (this.variableCategory && this.variableName && this.defaultUnit &&
      this.baseValue2.value !== '' && !isNaN(this.baseValue2.value) && this.baseValue2.value !== null) {
      if (this.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME ||
        this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME5) {
        this.displayValue2 = (Number(this.defaultUnit.slopeValueCs) / this.baseValue2.value) - Number(this.defaultUnit.interceptValueCs);

      } else {
        this.displayValue2 = (Number(this.baseValue2.value) - Number(this.defaultUnit.interceptValueCs)) / Number(this.defaultUnit.slopeValueCs);

      }
      this.displayValue2 = parseFloat(this.displayValue2).toFixed(this.GetPrecison());
      this.displayValue2 = isNaN(this.displayValue2) ? '' : this.displayValue2;
      this.emitUomObj();
    } else {
      this.displayValue2 = null;
    }
    this.display.emit(this.displayValue2);
  }


  updateBaseValue2() {
    if (!isNaN(parseFloat(this.displayValue2))) {
      if (this.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME5) {

        this.baseValue2.value = Number(this.defaultUnit.slopeValueCs) / (this.displayValue2 + Number(this.defaultUnit.interceptValueCs));
        this.baseValue2.name = UomCategory.FBP;
      } else {

        this.baseValue2.value = this.displayValue2 * Number(this.defaultUnit.slopeValueCs) + Number(this.defaultUnit.interceptValueCs);
        this.baseValue2.name = UomCategory.FBP;
      }
      this.newbaseValueChange.emit(this.baseValue2);

      this.displayValue2 = this.displayValue2.toFixed(this.GetPrecison());
      this.displayValue2 = isNaN(this.displayValue2) ? '' : this.displayValue2;
      this.emitUomObj();
    } else if (this.displayValue2 === '' || this.displayValue2 === null || this.displayValue2 === undefined) {

      this.baseValue2.value = null;
      this.baseValue2.name = UomCategory.FBP;


      this.newbaseValueChange.emit(this.baseValue2);
      this.emitUomObj();
    }
  }


  updateDisplayValue2() {

    if (this.variableCategory && this.variableName && this.defaultUnit && !isNaN(this.baseValue2.value) && (this.baseValue2.value !== null)
      && (this.baseValue2.value !== '')) {
      if (this.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME5) {
        this.displayValue2 = (Number(this.defaultUnit.slopeValueCs) / this.baseValue2.value) - Number(this.defaultUnit.interceptValueCs);
      } else {
        this.displayValue2 = (Number(this.baseValue2.value) - Number(this.defaultUnit.interceptValueCs)) / Number(this.defaultUnit.slopeValueCs);

      }
      this.displayValue2 = parseFloat(this.displayValue2).toFixed(this.GetPrecison());
      this.displayValue2 = isNaN(this.displayValue2) ? '' : this.displayValue2;
      this.emitUomObj();
    } else {
      this.displayValue2 = null;
    }
    this.display.emit(this.displayValue2);
  }

  emitUomObj() {
    this.uomInstanceChange.emit({
      'displayValue': this.displayValue, 'defaultUnitText': this.defaultUnit.unitDisplayName,
      'baseValue': this.baseValue, 'id': this.defaultUnit.id
    });
  }

  updateDisplayValue() {

    if (this.variableCategory && this.variableName && this.defaultUnit && !isNaN(this.baseValue) && (this.baseValue !== null)
      && (this.baseValue !== '' && this.baseValue !== undefined)) {
      if (this.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME5) {
        this.displayValue = (Number(this.defaultUnit.slopeValueCs) / this.baseValue) - Number(this.defaultUnit.interceptValueCs);
      } else {
        this.displayValue = (Number(this.baseValue) - Number(this.defaultUnit.interceptValueCs)) / Number(this.defaultUnit.slopeValueCs);
      }
      this.displayValue = parseFloat(this.displayValue).toFixed(this.GetPrecison());
      this.displayValue = isNaN(this.displayValue) ? '' : this.displayValue;
      this.emitUomObj();
    } else {
      this.displayValue = null;
    }
    this.display.emit(this.displayValue);
  }





  updateDisplay(value) {
    this.displayValue = this.baseValue;
  }
  GetPrecison() {
    console.log(this.uomObj.variableDecimalPoint)
    if (this.uomObj.variableDecimalPoint != null) {
      return this.uomObj.variableDecimalPoint;
    } else {
      return 6;
    }
  }

  setUnits() {
    if (this.variableCategory && this.variableName) {
      if (this.unitItems) {
        this.units = this.unitItems;
        this.uomObj = this.units[0];
        this.doSetUnitOperation();
      }
      else {
        this.manageVariableService.getUOMListByCategoryAndVariable(this.variableCategory, this.variableName).subscribe(result => {
          this.uomObjList = result.data;
          this.uomObj = this.uomObjList[0];
          this.units = this.uomObjList;
          this.doSetUnitOperation();
        });
      }
    }
  }

  doSetUnitOperation() {
    if (this.resetUnit !== 'edit') {
      this.loadUnits.emit(this.units);
    }
    this.units.forEach(element => {
      if (element.isDefaultUOM === true) {
        this.defaultUnit = element;
      }
    });
    if (this.defaultUnit) {
      this.unitsChange(this.defaultUnit);
    }
    this.updateDisplayValue();
  }



  preventNonNumericalInput(evt: any) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    const number = evt.target.value.split('.');
    if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    if (number.length > 1 && charCode === 46) {
      return false;
    }
  }

  unitsChange(data) {
    this.defaultunitChange.emit(this.defaultUnit);
    this.defaultunitChange1.emit(this.defaultUnit);
    this.defaultunitChange2.emit(this.defaultUnit);
    this.defaultunitChange3.emit(this.defaultUnit);

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
