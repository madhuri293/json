import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,AbstractControl, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap';
import { NotificationService } from '../../core/services/notification/notification-service.service';
import { RolesService } from '../manage/roles/roles.service';
import { CommonService } from '../../shared/common-services/common.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder,
    private roleService: RolesService, private notify:
      NotificationService, private bsModalService: BsModalService,
    private commonService: CommonService) { }

  ngOnInit() {

  }
  reportFromControls() {

  }



  getReports() {


  }


  saveReport() {



  }
  deleteConfirmation(role: any) {


  }





  stringValidator(stringValue: AbstractControl): ValidatorFn {
    const value = stringValue.value;
    return (group: FormGroup) => {
      if (stringValue.enabled && stringValue.dirty) {
        if (value.match('/^\S*$/')) {
          value.setErrors({ patternError: true });
          return null;
        } else {
          value.setErrors(null);
          return null;
        }
      }
    };
  }





  ngOnDestroy() {
    this.commonService.configFlag = new BehaviorSubject(false);
  }
}


