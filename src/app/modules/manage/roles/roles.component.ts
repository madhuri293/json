import { Component, OnInit, OnDestroy } from '@angular/core';
import { Role, RoleDTO } from './roles.model';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { RolesService } from './roles.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { BehaviorSubject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-role',
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit, OnDestroy {

  roleDTO: RoleDTO = new RoleDTO();

  constructor(private formBuilder: FormBuilder,
    public roleService: RolesService, private notify:
      NotificationService, private bsModalService: BsModalService, private router: ActivatedRoute,
    private commonService: CommonService, private dashboardService: DashboadrdService) {
    this.roleDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;
    this.roleDTO.loading = true;
    this.roleColumns();
    this.roleFromControls();
    this.getRoles();
    this.roleDTO.nOfRecordPage = 10;

    this.getStatus();
    this.refresh();
  }

  getStatus() {
    this.roleDTO.statusList = this.commonService.getStatusList();
  }
  roleFromControls() {
    this.roleDTO.roleForm = this.formBuilder.group(
      {
        roleName: new FormControl('', [Validators.required, Validators.maxLength(100),
        Validators.pattern(SPACE_REGEXP)
        ]),
        roleDescription: new FormControl('', [Validators.maxLength(100)]),
        status: new FormControl('', [Validators.required])
      });
  }

  roleColumns() {
    this.roleDTO.columns = [
      { field: 'roleName', header: 'Role Name' },
      { field: 'description', header: 'Role Description' },
      { field: 'status', header: 'Status' },
    ];
    if (this.roleDTO.privilege) {
      this.roleDTO.columns.push({ field: 'action', header: 'Action' });
    }
  }

  getRoles() {
    this.roleService.loading = true;
    this.roleService.getAllroles().subscribe(result => {
      result.data.forEach(data => {

        data.status = this.commonService.getStatus(data);
      });
      this.roleDTO.allRoles = result.data;
      this.roleDTO.totalRecords = this.roleDTO.allRoles.length;
      this.roleDTO.numberOfRecords = this.roleDTO.allRoles.length;
      this.roleService.loading = false;
    },
      (error) => {
        this.roleService.loading = false;
      });

  }


  saveRole(role: Role) {
    this.roleDTO.isDisabled = true;
    if (role.id) {
      this.roleService.update(role).subscribe(result => {
        if (result) {
          this.roleDTO.isDisabled = false;
          this.notify.showSuccess(result.body.message);
          this.onResetClick();
        } else {
          this.notify.showError(result.body.Message);
        }
      },
        (error) => {
          this.roleDTO.isDisabled = false;
          this.notify.showError(error.message);
        });

    } else {
      this.roleService.save(role).subscribe(result => {
        if (result) {
          this.onResetClick();
          this.roleDTO.isDisabled = false;
          this.notify.showSuccess(result.body.message);
        }
      }, (error) => {
        this.roleDTO.isDisabled = false;
        this.notify.showError(error.message);
      });
    }



  }
  onResetClick() {
    this.roleDTO.role = new Role();
    this.roleDTO.roleForm.reset();
    this.getRoles();
    this.commonService.sendToggleFlag(true);

  }
  onRoleEditClick(data: any) {
    this.roleDTO.isDisabled = false;
    this.roleService.getById(data.id).subscribe(role => {
      this.roleDTO.role = role.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });

  }


  find(role: any) {

    if (this.roleDTO.roleForm.dirty || this.roleDTO.roleForm.valid) {
      this.roleService.loading = true;
      this.roleService.findRole(role).subscribe(result => {
        if (result.body.data) {
          this.roleDTO.roles = result.body.data;
          this.commonService.sendToggleFlag(true);

          this.roleDTO.roles.forEach(data => {
            data.status = this.commonService.getStatus(data);
          });

          this.roleDTO.allRoles = this.roleDTO.roles;
          this.roleDTO.totalRecords = this.roleDTO.allRoles.length;
          this.notify.showSuccess(result.body.message);
        } else {
          this.notify.showError('No records found');
          this.roleDTO.totalRecords = 0;
          this.roleDTO.allRoles = null;
        }
        this.roleService.loading = false;
      },

        (error) => {
          this.roleDTO.roleList = [];
          this.notify.showError(error.message);
          this.roleService.loading = false;
        });
    } else {
      this.notify.showError('Enter at least one field to search');
      this.roleDTO.allRoles = this.roleDTO.allRoles;
    }

  }
  deleteConfirmation(role: any) {

    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );

    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.roleDTO.roleId = role.id;
        this.roleDTO.skId = role.sk;
        this.roleService.delete(this.roleDTO.roleId, this.roleDTO.skId).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.roleDTO.role = new Role();
          this.roleDTO.roleForm.reset();
          this.getRoles();
        }, (error) => {
          this.notify.showError(error.message);
        });
        this.roleService.configFlag = new BehaviorSubject(false);
      }
    });
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

  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.roleDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.roleService.loading = true;
        this.roleDTO.loading = true;
        this.roleColumns();
        this.roleFromControls();
        this.getRoles();
        this.roleDTO.nOfRecordPage = 10;
        this.getStatus();
      }
    });
  }
}

