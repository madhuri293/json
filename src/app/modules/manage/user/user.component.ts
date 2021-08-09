import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Validators, FormBuilder } from '@angular/forms';
import { User, TechnologyRole, UserDTO } from './user.model';
import { TechnologyService } from '../technology/technology.service';
import { RolesService } from '../roles/roles.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { emailValidator } from '../../../core/validators.ts/validators';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { BehaviorSubject } from 'rxjs';
import { StatusEnum, DeleteMessageEnum, UserRoleTechnology } from '../../../shared/enum/enum.model';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  technologyRoleDetail: TechnologyRole = new TechnologyRole();
  user = new User();
  tech: any;
  userDTO: UserDTO = new UserDTO();
  checkArray: any = [];
  constructor(private formBuilder: FormBuilder, public userService: UserService,
    public technologyService: TechnologyService,
    public roleService: RolesService,
    public notify: NotificationService,
    private commonService: CommonService,
    private bsModalService: BsModalService,
    private route: ActivatedRoute,
    private dashboardService: DashboadrdService
  ) {
    this.userDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
  }
  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;
    this.userService.loading = true;
    this.userDTO.nOfRecordPage = 10;
    this.userDTO.nOfRecordPage1 = 5;
    this.userDTO.formExtraValidate = false;
    this.userDTO.roleArray = [];
    this.getUsersList();
    this.userFormControls();
    this.getRoles();
    this.department();
    this.userDTO.isRoleChecked = false;
    this.userDTO.ischecked = false;
    this.userDTO.technologyRoleListcolumns = [
      { filed: 'selected', header: '' },
      { field: 'technologyName', header: 'Technology' },
      { field: 'roles', header: 'Role' },
    ];


    this.userDTO.cols = [
      { field: 'eId', header: 'EID' },
      { field: 'firstName', header: 'First Name' },
      { field: 'middleName', header: 'Middle Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'phone', header: 'Phone' },
      { field: 'email', header: 'Email' },
      { field: 'departmentName', header: 'Department' },
      { field: 'technologyRoleDescription', header: 'Role' },
      { field: 'status', header: 'Status' }
    ];

    if (this.userDTO.privilege) {
      this.userDTO.cols.push({ field: 'action', header: 'Action' });
    }
    this.getStatus();
    this.refresh();
  }
  getStatus() {
    this.userDTO.statusList = this.commonService.getStatusList();
  }
  userFormControls() {
    this.userDTO.userForm = this.formBuilder.group({
      eid: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern(SPACE_REGEXP)])],
      firstName: ['', Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern(SPACE_REGEXP)])],
      middleName: ['', Validators.maxLength(100)],
      lastName: ['', Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern(SPACE_REGEXP)])],
      phoneNumber: ['', Validators.compose([Validators.maxLength(10)])],
      email: ['', Validators.compose([Validators.required])],
      department: ['', Validators.compose([Validators.required])],
      status: ['', Validators.compose([Validators.required])],
    });
    this.userDTO.userForm.setValidators(emailValidator(this.userDTO.userForm.controls.email));
  }
  paginate(event: any) {
    this.userDTO.loading = true;
    this.userDTO.nOfRecordPage1 = event.rows;
    this.userDTO.page = event.page;
    this.userDTO.pageRows = event.rows;

    if (this.userDTO.usersList) {
      this.userDTO.technologyDetails = this.userDTO.technologyRoleslist.slice(event.first, event.first + this.userDTO.nOfRecordPage1);
      this.userDTO.loading = false;
    }

  }

  onRowEditClick(user: User) {
    this.user = user;
    this.userDTO.application = this.user.role.roleId.split(',')[0];
    this.userDTO.roleForApplication = this.user.role.roleId.split(',')[1];
    this.userDTO.selectedApplication = true;
  }
  onRowEditSave(user: User, index: number) {
  }
  /**
   * @param user user object to save
   */
  saveUser(user: User) {

    const userinfo = {
      departmentId: user.departmentId,
      eId: user.eId, email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      phone: user.phone,
      status: user.status,
      technologyRoleDescription: '',
      uomTemplateId: '',
      isSuperAdmin: user.isSuperAdmin,
      id: user.id ? user.id : null,
      // userTechnologyRole: this.userDTO.roleArray,
      userTechnologyRole: this.userDTO.technologyRoleDetailList,
    };
    if (user.id) {
      this.userDTO.technologyRoleDetailList = [];
      this.userDTO.technologyRoleslist.forEach(technologyRole => {
        if (technologyRole.selected === true) {
          const userTechnologyRoleTemp = {
            technologyId: technologyRole.id,
            roleId: technologyRole.role,
            userId: user.id,
          };
          this.userDTO.technologyRoleDetailList.push(userTechnologyRoleTemp);
        }
      });
      userinfo.userTechnologyRole = this.userDTO.technologyRoleDetailList;
      this.userService.update(userinfo).subscribe(result => {
        this.notify.showSuccess(result.body.message);

        this.onReset();
        this.getUsersList();
      },
        (error) => {

          this.notify.showError(error.message);
        });
    } else {
      this.userDTO.technologyRoleDetailList = [];
      this.userDTO.technologyRoleslist.forEach(technologyRole => {
        if (technologyRole.selected === true) {
          const userTechnologyRoleTemp = {
            technologyId: technologyRole.id,
            roleId: technologyRole.role,
            userId: '',
          };
          this.userDTO.technologyRoleDetailList.push(userTechnologyRoleTemp);
        }
      });

      userinfo.userTechnologyRole = this.userDTO.technologyRoleDetailList;
      // Added superAdmin-
      this.userService.save(userinfo).subscribe(result => {
        this.notify.showSuccess(result.body.message);
        this.onReset();
        this.getUsersList();
      },
        (error) => {

          this.notify.showError(error.message);
        });
    }
  }
  saveTechnologyRole(userId) {
    this.userDTO.technologyRoleDetailList = [];
    this.userDTO.technologyRoleslist.forEach(technologyRole => {
      if (technologyRole.selected === true) {
        const userroleinfo = {
          technologyId: technologyRole.technologyId,
          roleId: technologyRole.role,
          userId: userId,
        };
        this.userDTO.technologyRoleDetailList.push(userroleinfo);
      }
    });
    this.userService.postUserTechnology(this.userDTO.technologyRoleDetailList).subscribe((res) => {
    });
    this.onReset();
    this.getUsersList();
  }
  onReset() {
    this.userDTO.roleArray = [];
    this.userDTO.ischecked = false;
    this.userDTO.userForm.reset();
    this.user.departmentId = '';
    this.user.eId = '';
    this.user.email = '';
    this.user.firstName = '';
    this.user.lastName = '';
    this.user.middleName = '';
    this.user.phone = '';
    this.user.id = '';
    this.user.department = '';
    this.user.updatedOnDate = '';
    this.user.uomTemplateId = '';
    if (this.userDTO.technologyRoleslist.length > 0) {
      this.userDTO.technologyRoleslist.forEach(element => {
        element.selected = false;
        element.role = '';
      });
      this.userDTO.showDepartment = false;
      this.userDTO.showStatus = false;
      setTimeout(() => {
        this.userDTO.showDepartment = true;
        this.userDTO.showStatus = true;

      });
    }
    this.getUsersList();
    this.technologyRoleTableValidation();
    this.commonService.sendToggleFlag(true);

  }
  checkSelected(checkval: any, index: any, event) {
    let tableIndex = (this.userDTO.page * this.userDTO.pageRows) + index;
    this.userDTO.ischecked = checkval;
    if (!checkval) {
      this.userDTO.technologyRoleslist.forEach((element) => {
        if (this.userDTO.roleArray && this.userDTO.roleArray.length > 0) {
          this.userDTO.roleArray.forEach((val, i) => {
            if (val === element.role && element.technologyName === this.userDTO.technologyRoleslist[tableIndex].technologyName) {
              element.selected = false;
              element.role = '';
              this.userDTO.roleArray.splice(i, 1);
            }
            this.technologyRoleTableValidation();
          });
        } else {
          this.userDTO.technologyRoleslist.forEach((element1, i) => {
            tableIndex = (this.userDTO.page * this.userDTO.pageRows) + index;
            if (tableIndex === i) {
              element1.selected = false;
              element1.role = '';
            }
          });
          this.technologyRoleTableValidation();
        }
      });
    } else {
      this.technologyRoleTableValidation();
    }
    const avail = this.userDTO.technologyRoleslist.find(x => x.selected === true);
    if (avail) {
      this.userDTO.formExtraValidate = true;
    } else {
      this.userDTO.formExtraValidate = false;
    }
  }
  roleSelected(event, tech) {

    tech.role = event;
    this.userDTO.roleArray.push(tech.role);
    this.userDTO.techRoleId = tech.role;
    this.technologyRoleTableValidation();
  }

  getUsersList() {
    this.userService.loading = true;
    this.userService.getUsers().subscribe(result => {
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.userDTO.usersList = result.data;
      this.userDTO.totalRecords = this.userDTO.usersList.length;
      this.userDTO.userDetails = this.userDTO.usersList.slice(0, this.userDTO.nOfRecordPage);
      this.userService.loading = false;
    }, (error) => {
      this.userService.loading = false;
    });

  }
  deleteConfirmation(userdata: any) {
    this.userDTO.sk = userdata.id;
    this.userDTO.userId = userdata.id;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );

    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.userService.delte(this.userDTO.userId, this.userDTO.sk).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.onReset();
          this.getUsersList();
        }, (error) => {
          this.notify.showError(error.message);
        });
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });

  }
  onApplicationRoleSelect(selected: boolean, data: any, index) {
    this.userDTO.userindex = index;
    const rolelist = {
      index: index,
      check: selected,
      technologydata: data
    };
    this.userDTO.userindex = index;
    if (selected === true) {
      this.userDTO.selectedRole.push(rolelist);
    }
    if (selected === false) {
      this.userDTO.selectedRole.pop();
    }
    this.userDTO.selectedRole.forEach((res) => {
      this.userDTO.indexval = res.index;
      (<HTMLInputElement>document.getElementById('roleid' + res.index)).disabled = false;
    });
    let applicationRole = '';
    this.userDTO.selectedRole.forEach((result) => {
      applicationRole += result.application + ',' + result.roleForApplication;
    });
    this.user.role.roleId = applicationRole;
  }
  getRoles() {
    this.technologyService.getAll().subscribe(technologyResult => {
      technologyResult = technologyResult.data.filter(data => data.status === StatusEnum.Y);
      this.userDTO.technologyRoleslist = technologyResult;
      this.roleService.getAllroles().subscribe(roleResult => {
        this.userDTO.userrolelist = roleResult;
        this.userDTO.userrolelist.data.sort((a, b) => {
          if (a.roleName.toLocaleLowerCase() > b.roleName.toLocaleLowerCase()) {
            return 1;
          } else if (a.roleName.toLocaleLowerCase() < b.roleName.toLocaleLowerCase()) {
            return -1;
          } else {
            return 0;
          }
        });
        roleResult = roleResult.data.filter(data => data.status === StatusEnum.Y);
        this.userDTO.technologyRoleslist.forEach(data => {
          data.roles = roleResult;
          data.selected = false;
          data.role = '';
        });

      });

      this.userDTO.totalRecords1 = this.userDTO.technologyRoleslist.length;
      this.userDTO.technologyRoleslist.sort((a, b) => {
        if (a.technologyName.toLocaleLowerCase() > b.technologyName.toLocaleLowerCase()) {
          return 1;
        } else if (a.technologyName.toLocaleLowerCase() < b.technologyName.toLocaleLowerCase()) {
          return -1;
        } else {
          return 0;
        }
      });

      this.userDTO.technologyDetails = this.userDTO.technologyRoleslist.slice(0, this.userDTO.nOfRecordPage1);
    });

  }
  onRoleEditClick(data: any) {
    if (this.userDTO.technologyRoleslist.length > 0) {
      this.userDTO.technologyRoleslist.forEach(element => {
        element.selected = false;
        element.role = '';
      });
      this.userDTO.showDepartment = false;
      this.userDTO.showStatus = false;
      setTimeout(() => {
        this.userDTO.showDepartment = true;
        this.userDTO.showStatus = true;

      });
    }
    this.userDTO.userForm.reset();
    this.userService.getById(data.id).subscribe(result => {
      this.user = result.data;
      data.userTechnologyRole.forEach(UserTechnologies => {
        this.userDTO.technologyRoleslist.forEach(techrolelist => {
          this.userDTO.technologyRoleslist.forEach((technology, j) => {
            if (techrolelist.id === UserTechnologies.technologyId && technology.id === UserTechnologies.technologyId) {
              this.userDTO.technologyRoleslist[j].selected = true;
              this.userDTO.technologyRoleslist[j].role = UserTechnologies.roleId;
            }
            this.technologyRoleTableValidation();
          });
        });
      });

    });
  }

  findUser(user: any) {
    this.userDTO.technologyRoleDetailList = [];
    this.userDTO.technologyRoleslist.forEach(technologyRole => {
      if (technologyRole.selected === true) {
        const userroleinfo = {
          technologyId: technologyRole.id,
          roleId: technologyRole.role,
        };
        this.userDTO.technologyRoleDetailList.push(userroleinfo);
      }
    });
    user.UserApplicationRole = [];
    user.userTechnologyRole = this.userDTO.technologyRoleDetailList;
    /**added for fiond role */
    if (this.userDTO.roleArray) {
      this.userDTO.roleArray.forEach(role => {
        const roleObject = { roleId: role };
        user.userTechnologyRole.push(roleObject);
      });
    }
    if (user.status === StatusEnum.INACTIVE || user.status === StatusEnum.ACTIVE) {
      user.status = StatusEnum.INACTIVE ? StatusEnum.N : StatusEnum.Y;
    }
    this.userService.loading = true;
    this.userService.find(user).subscribe(result => {
      this.userDTO.usersList = result.body.data;
      this.userDTO.usersList.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.userDTO.totalRecords = this.userDTO.usersList.length;
      this.userDTO.userDetails = this.userDTO.usersList;
      this.notify.showSuccess(result.body.message);
      this.userService.loading = false;
    },
      (error) => {
        this.userDTO.userDetails = null;
        this.userDTO.totalRecords = 0;
        this.notify.showError(error.message);
        this.userService.loading = false;
        this.getStatus();
      });
  }
  technologyRoleTableValidation() {
    this.userDTO.roleSelected = this.userDTO.technologyRoleslist.filter(val => (val.selected === true && val.role !== ''));
    this.userDTO.roleUnSelected = this.userDTO.technologyRoleslist.filter(val1 => (val1.selected === true && val1.role === '') ||
      (val1.selected === false && val1.role !== ''));
    this.roleCheck();
  }
  roleCheck() {
    if (this.userDTO.roleSelected.length === UserRoleTechnology.ZERO && this.userDTO.roleUnSelected.length > UserRoleTechnology.ZERO) {
      this.userDTO.isRoleChecked = false;
    } else if (this.userDTO.roleSelected.length > UserRoleTechnology.ZERO && this.userDTO.roleUnSelected.length > UserRoleTechnology.ZERO) {
      this.userDTO.isRoleChecked = false;
      // tslint:disable-next-line:max-line-length
    } else if (this.userDTO.roleSelected.length === UserRoleTechnology.ZERO && this.userDTO.roleUnSelected.length === UserRoleTechnology.ZERO) {
      this.userDTO.isRoleChecked = false;
      // tslint:disable-next-line:max-line-length
    } else if (this.userDTO.roleSelected.length > UserRoleTechnology.ZERO && this.userDTO.roleUnSelected.length === UserRoleTechnology.ZERO) {
      this.userDTO.isRoleChecked = true;
    }
  }
  department() {
    this.userService.getDepartment(department => {
      this.userDTO.departmentList = department.data;
    });
  }
  technologyRecordpaginate(evt) {
    this.userDTO.nOfRecordPage = evt.rows;
    this.userDTO.roles = this.userDTO.technologyRecord.slice(evt.first, evt.first + this.userDTO.nOfRecordPage);
  }

  changePageEvent(evt) {
    this.userDTO.nOfRecordPage = evt.rows;
    this.userDTO.userDetails = this.userDTO.usersList.slice(evt.first, evt.first + this.userDTO.nOfRecordPage);
  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.userDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.userService.loading = true;
        this.userDTO.nOfRecordPage = 10;
        this.userDTO.nOfRecordPage1 = 5;
        this.userDTO.formExtraValidate = false;
        this.userDTO.roleArray = [];
        this.getUsersList();
        this.userFormControls();
        this.getRoles();
        this.department();
        this.userDTO.isRoleChecked = false;
        this.userDTO.ischecked = false;
        this.userDTO.technologyRoleListcolumns = [
          { filed: 'selected', header: '' },
          { field: 'technologyName', header: 'Technology' },
          { field: 'roles', header: 'Role' },
        ];
        this.userDTO.cols = [
          { field: 'eId', header: 'EID' },
          { field: 'firstName', header: 'First Name' },
          { field: 'middleName', header: 'Middle Name' },
          { field: 'lastName', header: 'Last Name' },
          { field: 'phone', header: 'Phone' },
          { field: 'email', header: 'Email' },
          { field: 'departmentName', header: 'Department' },
          { field: 'technologyRoleDescription', header: 'Role' },
          { field: 'status', header: 'Status' }
        ];

        if (this.userDTO.privilege) {
          this.userDTO.cols.push({ field: 'action', header: 'Action' });
        }
        this.getStatus();
      }
    });
  }
}
