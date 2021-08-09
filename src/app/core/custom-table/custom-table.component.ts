import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  Router } from '@angular/router';
import { CustomTableDTO } from './custom-table.model';
import { UomCategory } from './../../shared/enum/enum.model';
import { CommonService } from '../../shared/common-services/common.service';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
})
export class CustomTableComponent implements OnInit {
  @Input() value: any[] = [];
  @Input() columns: any[] = [];
  @Input() componentName: any;
  @Input() selectedRows: any;
  @Input() nOfRecordPage: any;
  @Input() totalRecords: any;
  @Input() first: any;
  customTableDTO: CustomTableDTO = new CustomTableDTO();



  @Output() ondelete: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  @Output() pageChange1: EventEmitter<any> = new EventEmitter();
  @Output() radioButtonClick: EventEmitter<any> = new EventEmitter();
  @Output() checkBoxSelect: EventEmitter<any> = new EventEmitter();
  @Output() onEquipmentClick: EventEmitter<any> = new EventEmitter();
  @Output() onCalibrationButtonClick: EventEmitter<any> = new EventEmitter();
  @Output() pageReset: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private commonService: CommonService) {
  }

  ngOnInit() {
    this.first = 0;
    this.commonService.sendFlag.subscribe(res => {
      if (res) {
        const obj = {
          first: 0
        };
        this.paginate(obj);
      }
    });

    this.commonService.sendFlagFind.subscribe(val => {
      if (val) {
        const resetobj = {
          first: 0
        }
        this.paginate(resetobj);
      }
    })
  }


  deleteConfirmation(role: any) {
    this.ondelete.emit(role);
  }
  onRoleEditClick(val: any) {
    this.customTableDTO.rowClick = true;
    this.onEdit.emit(val);
  }


  onRadioButtonClick(event: any, data: any) {
    this.radioButtonClick.emit({ event, data });
  }
  onCheckBoxSelect(event: any, data: any) {
    if (data.checked === true) {
      this.customTableDTO.resultSet.push(data);
    } else {
      this.customTableDTO.resultSet.pop();
    }
    this.checkBoxSelect.emit(this.customTableDTO.resultSet);
  }


  onEquipmentNameClick(data: any, index: any) {
    const obj = {
      data: data,
      index: index
    };
    this.onEquipmentClick.emit(obj);
  }


  unitChange(evt: any) {
    this.customTableDTO.selectedtemplate = evt;
  }

  unitChange1(evt: any) {
    this.customTableDTO.selectedtemplate1 = evt;
  }
  unitChange2(evt: any) {
    this.customTableDTO.selectedtemplate2 = evt;
  }
  unitChange3(evt: any){
    this.customTableDTO.selectedtemplate3 = evt;
  }
  customSort(event: any) {
    if (event.field !== UomCategory.FBP.toLocaleLowerCase() && event.field !== UomCategory.IBP.toLocaleLowerCase()) {
      event.data.sort((data1, data2) => {
        const value1 = data1[event.field];
        const value2 = data2[event.field];
        let result = null;
        if (!(Number(value1) && Number(value2))) {


          if (value1 == null && value2 != null) {
            result = -1;
          } else if (value1 != null && value2 == null) {
            result = 1;
          } else if (value1 == null && value2 == null) {
            result = 0;
          } else if (typeof value1 === 'string' && typeof value2 === 'string') {
            result = value1.localeCompare(value2);
          } else {
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
          }
        } else {
          result = Number(value1) * 1000 - Number(value2) * 1000;
        }
        return (event.order * result);
      });
    }
  }

  paginate(event) {
    this.first = event.first;
    this.pageReset.emit(this.first);
  }
}
