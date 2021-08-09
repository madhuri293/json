import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MenuItem, PrivilageDTO } from './priviege.model';
import { ITreeOptions, IActionMapping, TreeComponent, TreeModel } from 'angular-tree-component';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { PrivilegeService } from './privilege.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { TechnologyService } from '../technology/technology.service';
import { RolesService } from '../roles/roles.service';
import { StatusEnum } from '../../../shared/enum/enum.model';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { CommonService } from '../../../shared/common-services/common.service';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html'
})
export class PrivilegeComponent implements OnInit {

  @ViewChild('tree', { read: TreeComponent }) treeComponent: TreeComponent;

  privilageDTO: PrivilageDTO = new PrivilageDTO();
  actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node) => this.check(node, !node.data.isEnabled)
    }
  };

  option: ITreeOptions = {
    useCheckbox: false,
    displayField: 'functionName',
    isExpandedField: 'children',
    hasChildrenField: 'children',
    actionMapping: this.actionMapping
  };

  constructor(
    private formBuilder: FormBuilder,
    public privilegeService: PrivilegeService,
    private rolesService: RolesService,
    private technologyService: TechnologyService,
    private dashboardService: DashboadrdService,
    private route: ActivatedRoute,
    private notify: NotificationService,
    private commonService: CommonService,
    private router: ActivatedRoute
  ) {
    this.privilageDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }



  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;

    this.roleFromControls();
    this.getRoles();
    this.getTechnologies();
  }

  ngAfterInit() {
    const treeModel: TreeModel = this.treeComponent.treeModel;
    treeModel.expandAll();
  }
  getRoles() {
    this.privilegeService.getAllroles().subscribe(result => {
      this.privilageDTO.roles = result.data;
      this.privilageDTO.roles.sort((a, b) => {
        if (a.roleName.toLocaleLowerCase() > b.roleName.toLocaleLowerCase()) {
          return 1;
        } else if (a.roleName.toLocaleLowerCase() < b.roleName.toLocaleLowerCase()) {
          return -1;
        } else {
          return 0;
        }
      });

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }


  getTechnologies() {
    this.privilegeService.loading = true;
    const user = this.commonService.decrypt(localStorage.getItem('userObj'));
    const isAdmin = JSON.parse(user);
    if (isAdmin.isSuperAdmin) {
      this.dashboardService.getSuperAdminTechnologies().subscribe(result => {
        this.privilageDTO.applications = result.data;
        this.privilageDTO.applications.sort((a, b) => {
          if (a.technologyName.toLocaleLowerCase() > b.technologyName.toLocaleLowerCase()) {
            return 1;
          } else if (b.technologyName.toLocaleLowerCase() > a.technologyName.toLocaleLowerCase()) {
            return -1;
          } else {
            return 0;
          }
        });

        this.privilegeService.loading = false;
      }, error => {
        this.privilegeService.loading = false;
      });
    } else {
      this.dashboardService.getTechnologies().subscribe(result => {
        this.privilageDTO.applications = result.data;
        this.privilageDTO.applications = this.privilageDTO.applications.filter(application => application.status === StatusEnum.Y);
        this.privilegeService.loading = false;

      }, error => {
        this.privilegeService.loading = false;
      });
    }

  }

  roleFromControls() {
    this.privilageDTO.privilageForm = this.formBuilder.group(
      {
        application: new FormControl(''),
        role: new FormControl(''),
      }
    );
  }

  onRoleChange(unique: any) {
    this.privilageDTO.selectedRole = this.privilageDTO.roles.find(({ id }) => id === unique);
    this.loadMenu();
  }
  onApplicationChange(unique: string) {
    this.privilageDTO.selectedApplication = this.privilageDTO.applications.find(({ id }) => id === unique);
    this.loadMenu();
  }


  loadMenu() {
    if (this.privilageDTO.selectedApplication && this.privilageDTO.selectedRole) {
      this.privilegeService.loading = true;
      this.privilegeService.getMenu(
        this.privilageDTO.selectedApplication.id,
        this.privilageDTO.selectedRole.id
      ).subscribe((data: MenuItem[]) => {
        this.privilageDTO.menu = data;
        this.privilageDTO.unmodifiedData = [...data];
        this.generateTree();
        this.privilegeService.loading = false;
      },
        (error) => {
          this.notify.showError(error.message);
          this.privilegeService.loading = false;
        }
      );
    }
  }


  generateTree() {
    this.privilageDTO.privilageTree = this.privilageDTO.menu;
  }

  toggleEdit($event, main_FunctionCode, sub_FunctionCode, privilage_Code) {
    const mainItem: any = _.find(this.privilageDTO.menu, { 'functionCode': main_FunctionCode });
    const sub = _.find(mainItem.children, { 'functionCode': sub_FunctionCode });
    const pri = _.find(sub.children, { 'functionCode': privilage_Code });
    pri.isEnabled = !pri.isEnabled;
  }
  toggleView($event, main_FunctionCode, sub_FunctionCode, privilage_Code) {
    const mainItem: any = _.find(this.privilageDTO.menu, { 'functionCode': main_FunctionCode });
    const sub = _.find(mainItem.children, { 'functionCode': sub_FunctionCode });
    const pri = _.find(sub.children, { 'functionCode': privilage_Code });
    pri.isEnabled = !pri.isEnabled;
  }

  onUpdateData(tree) {
    tree.treeModel.expandAll();
  }

  resetPrivilage() {
    this.privilegeService.loading = true;
    setTimeout(() => {
      this.privilegeService.loading = false;
    }, 1000);
    this.privilageDTO.privilageForm.reset();
    this.privilageDTO.selectedApplication = null;
    this.privilageDTO.selectedRole = null;
    this.privilageDTO.privilageTree = null;
  }
  savePrivilage() {
    const data = {
      TechnologyId: this.privilageDTO.selectedApplication.id,
      RoleId: this.privilageDTO.selectedRole.id,
      PrevilegesList: this.privilageDTO.menu
    };

    if (this.privilageDTO.selectedApplication && this.privilageDTO.selectedRole && this.privilageDTO.menu) {
      this.privilegeService.loading = true;
      this.privilegeService.savePrivilage(data).subscribe(
        (response: any) => {
          this.privilegeService.loading = false;
          this.notify.showSuccess('Privilege saved successfully');
          this.privilageDTO.selectedApplication = null;
          this.privilageDTO.selectedRole = null;
          this.getRoles();
          this.getTechnologies();
        },
        error => {
          this.privilegeService.loading = false;
          this.notify.showError('Something went wrong');
        }
      );
    } else {
      this.notify.showError('Select technology and role');
    }
  }


  public check(node, checked) {
    this.updateChildNodeCheckbox(node, checked);
    this.updateParentNodeCheckbox(node.realParent);
  }
  public updateChildNodeCheckbox(node, checked) {
    node.data.isEnabled = checked;
    if (node.children) {
      node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
    }
  }
  public updateParentNodeCheckbox(node) {
    if (!node) {
      return;
    }

    let allChildrenChecked = true;
    let noChildChecked = true;

    for (const child of node.children) {
      if (!child.data.isEnabled) {
        allChildrenChecked = false;
      }
      if (child.data.isEnabled) {
        noChildChecked = false;
      }
    }

    if (allChildrenChecked) {
      node.data.isEnabled = true;
    } else if (noChildChecked) {
      node.data.isEnabled = false;
    } else {
      node.data.isEnabled = true;
    }
    this.updateParentNodeCheckbox(node.parent);
  }
}
