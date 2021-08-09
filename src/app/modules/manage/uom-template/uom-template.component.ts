import { Component, OnInit } from '@angular/core';
import { UomTemplate, UserTemplate, UomTemplateDTO } from './uom-template.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UomTemplateService } from './uom-template.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { TechnologyService } from '../technology/technology.service';
import { UserService } from '../user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { BehaviorSubject } from 'rxjs';
import { UomTemplateEnum, DeleteMessageEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-uom-template',
  templateUrl: './uom-template.component.html'
})
export class UomTemplateComponent implements OnInit {
  uomTemplate = new UomTemplate();
  userTemplate = new UserTemplate();
  uomTemplateDTO = new UomTemplateDTO();


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public uomTemplateService: UomTemplateService,
    public notify: NotificationService,
    private technologyService: TechnologyService,
    private userService: UserService,
    private commonService: CommonService,
    private bsModalService: BsModalService,
    private dashboardService: DashboadrdService,
    private route: ActivatedRoute
  ) {
    this.uomTemplateDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
  }

  ngOnInit() {
    this.refresh();
    this.dashboardService.showTechnologyHeader = true;
    this.uomTemplateService.loading = true;

    this.uomTemplateDTO.nOfRecordPage = 10;
    this.getApplication();
    this.uomTemplateFormControls();
    this.getUomTemplate();

    this.uomTemplateDTO.colsData = [
      { field: 'templateName', header: 'UOM Template  Name' },
      { field: 'UomDefault', header: ' ' },
      { field: 'UomVariableName', header: ' ' },
    ];
    if (this.uomTemplateDTO.privilege) {
      this.uomTemplateDTO.colsData.push({ field: 'Action', header: 'Action' });
    }
  }

  uomTemplateFormControls() {
    this.uomTemplateDTO.uomForm = this.formBuilder.group({
      uomTemplateName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100),
      Validators.pattern(SPACE_REGEXP)])),
      application: new FormControl('', Validators.compose([]))

    });
  }

  getApplication() {
    const selectedTechnology = localStorage.getItem('technology');
    this.uomTemplate.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.uomTemplateDTO.applicationList = result.data;
      this.uomTemplateDTO.applicationList = this.uomTemplateDTO.applicationList.filter(tech => tech.technologyId === selectedTechnology);
      this.uomTemplateDTO.applicationList = this.uomTemplateDTO.applicationList.filter(val => val.status === StatusEnum.Y);
    }, error => {
      this.notify.showError(error.message);
    });
  }
  getUomTemplate() {
    this.uomTemplateService.loading = true;
    this.uomTemplateService.getAll().subscribe(result => {
      this.uomTemplateDTO.uomTemplateList = result.data;
      this.uomTemplateDTO.uomTemplateList.forEach(val => {
        if (val.isSystemTemplate === StatusEnum.Y) {
          val.checked = true;
        }
        val.UomDefault = UomTemplateEnum.MAKEDEFAULT;
        val.UomVariableName = UomTemplateEnum.MANAGEVARIABLE;
      });

      this.uomTemplateDTO.totalRecords = this.uomTemplateDTO.uomTemplateList.length;
      this.uomTemplateService.loading = false;
      this.getDefaultTemplate();
    },
      (error) => {
        this.uomTemplateService.loading = false;
      });

  }
  getDefaultTemplate() {


  }
  deleteConfirmation(uomtemplate: any) {
    if (uomtemplate.defalutTemplateId === 'null') {
      this.notify.showWarning('System default cannot be deleted');
    } else {
      if (uomtemplate.checked) {
        this.notify.showWarning('Default template cannot be deleted');
      } else {
        const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
        (modal.content as CustomModalComponent).showConfirmationModal(
          DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
        );

        (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
          if (result) {
            this.uomTemplateDTO.uomTepmlateId = uomtemplate.id;
            this.uomTemplateService.delete(uomtemplate.id, uomtemplate.sk).subscribe(res => {
              this.notify.showSuccess(res.body.message);
              this.onFormReset();
              this.uomTemplateDTO.totalRecords = this.uomTemplateDTO.uomTemplateList.length;
            }, (error) => {
              this.notify.showError(error.message);
            });
            this.uomTemplateService.configFlag = new BehaviorSubject(false);
          }
        });


      }
    }

  }

  onRoleEditClick(data: any) {
    this.uomTemplateDTO.isDisable = false;
    this.uomTemplateService.templateId = data.id;
    this.uomTemplateService.name = data.name;
    this.uomTemplateService.getById(data.id).subscribe(
      result => {
        this.uomTemplate = result.data;
      }, error => {
        this.notify.showSuccess(error.message);
      });
  }

  onFormReset() {
    this.getUomTemplate();
    this.uomTemplateDTO.uomForm.reset();
    this.getApplication();
    this.getDefaultTemplate();
    this.commonService.sendToggleFlag(true);
  }

  findUomTemplate(data: any) {
    if (this.uomTemplateDTO.uomForm.valid || this.uomTemplateDTO.uomForm.dirty) {
      this.uomTemplateService.loading = true;
      this.uomTemplateService.findUomTemplate(data).subscribe(result => {
        this.uomTemplateDTO.uomTemplateDetails = result.body.data;
        this.commonService.sendToggleFlag(true);

        this.notify.showSuccess(result.body.message);
        const user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
        // tslint:disable-next-line:no-shadowed-variable
        this.userService.getById(user.userId).subscribe(res => {
          // tslint:disable-next-line:no-shadowed-variable
          this.uomTemplateDTO.uomTemplateDetails.forEach((value) => {
            value.UomDefault = UomTemplateEnum.MAKEDEFAULT;
            value.UomVariableName = UomTemplateEnum.MANAGEVARIABLE;
            if (value.isSystemTemplate === StatusEnum.Y) {
              value.checked = true;

            } else {
              value.checked = false;
            }
          });


          this.uomTemplateDTO.uomTemplateList = this.uomTemplateDTO.uomTemplateDetails;
          this.uomTemplateDTO.totalRecords = this.uomTemplateDTO.uomTemplateDetails.length;
        });

        this.uomTemplateService.loading = false;
      }, (error) => {
        this.notify.showError(error.message);
        this.uomTemplateDTO.uomTemplateDetails = null;
        this.uomTemplateDTO.totalRecords = 0;
        this.uomTemplateService.loading = false;
      });
    } else {
      this.notify.showError('Please enter at least one field to search');
    }

  }

  save(data: any) {
    this.uomTemplateService.loading = true;
    this.uomTemplateDTO.isDisable = true;
    const user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    data.userId = user.userId;
    data.technologyId = localStorage.getItem('technology');
    if (data.id) {
      this.uomTemplateService.update(data).subscribe(result => {
        this.onFormReset();
        this.notify.showSuccess(result.body.message);
        this.uomTemplateDTO.isDisable = false;
      },
        (error) => {
          this.uomTemplateDTO.isDisable = false;
          this.notify.showError(error.message);
          this.uomTemplateService.loading = false;
        });
    } else {
      this.uomTemplateService.save(data).subscribe(result => {
        this.onFormReset();
        this.uomTemplateDTO.isDisable = false;
        this.notify.showSuccess(result.body.message);
      }, error => {
        this.uomTemplateDTO.isDisable = false;
        this.notify.showError(error.message);
        this.uomTemplateService.loading = false;
      });
    }
  }

  onRadioButtonChange(data: any) {
    if (data.data.checked) {
      const user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
      this.userTemplate.userId = user.userId;
      this.userTemplate.uomTemplateId = data.data.id;
      this.uomTemplateService.saveUserTemplate(this.userTemplate.userId, this.userTemplate.uomTemplateId).subscribe(result => {
        localStorage.setItem('templateId', data.data.id);
        this.getUomTemplate();
        if (result.data === true) {
          this.notify.showSuccess('Template is marked as default');
        }

      }, (error) => {
      });
    }


  }



  onManageVariableClick(data: any) {
    this.router.navigate(['manage/manage-variables', data.data.id, data.data.templateName], {
      queryParams: {
        id: data.data.id,
        name: data.data.templateName
      }
    });
  }

  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.uomTemplateDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.uomTemplateService.loading = true;

        this.uomTemplateDTO.nOfRecordPage = 10;
        this.getApplication();
        this.uomTemplateFormControls();
        this.getUomTemplate();

        this.uomTemplateDTO.colsData = [
          { field: 'templateName', header: 'UOM Template  Name' },
          { field: 'UomDefault', header: ' ' },
          { field: 'UomVariableName', header: ' ' },
        ];
        if (this.uomTemplateDTO.privilege) {
          this.uomTemplateDTO.colsData.push({ field: 'Action', header: 'Action' });
        }
      }
    })
  }
}
