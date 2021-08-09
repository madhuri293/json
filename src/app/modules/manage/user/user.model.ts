import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class User extends EntityModel {
        eId: string;
        firstName: string;
        lastName: string;
        middleName: string;
        email: string;
        department: string;
        departmentId: string;
        status: any;
        phone: string;
        createdByUserId: string;
        createdOnDate: string;
        updatedByUserId: string;
        updatedOnDate: string;
        role: any;
        tech: any;
        uomTemplateId: any;
        isSuperAdmin: any;

}

export class TechnologyRole {
    selected: boolean;
    technologyName: string;
    technologyId: string;
    role: string;
    roles: Role[];
    code: string;
    colorCode: string;
    description: string;
    id: string;
    name: string;
    status: string;
}

export class Role {
    id: string;
    code: string;
    name: string;
    description: string;
    status: string;
}

export class UserDTO {
    cols: any;
    usersTempList: any[];
    usersList: any[];
    userBeforeEdit: any;
    columns: any[];
    technologyRoleListcolumns: any[];
    numberOfRecords: number;
    technologyRecords: number;
    userForm: FormGroup;
    statusList: any;
    roleList = [{ roleForApplication: 'admin' },
    { roleForApplication: 'manager' },
    { roleForApplication: 'Support' }];
    actionList = [];
    selectedApplication: boolean;
    recordsCount: number;
    application: any;
    roleForApplication: any;
    selectedRole = [];
    disableRole = true;
    userindex: any;
    technologyList: any;
    roles = [];
    technologyRoleslist = [];
    technologyRoleslist1 = [];
    indexval: any;
    indexchek: any;
    technologyRoleDetailList = [];
    departmentList: any;
    showDepartment = true;
    showStatus = true;
    loading: boolean;
    users: any[];
    technologyRecord = [];
    rolelistdata = [];
    formExtraValidate = false;
    userTechnologies: any;
    techName = [];
    nOfRecordPage: any;
    nOfRecordPage1: any;
    userrolelist: any;
    userDetails: any[];
    technologyDetails: any[];
    totalRecords: number;
    totalRecords1: number;
    techRoleId: any;
    ischecked: boolean;
    isRoleChecked: boolean;
    isRoleChecked1: boolean;
    roleArray: any = [];
    userId: any;
    sk: any;
  privilege: boolean;
  roleSelected:any;
  roleUnSelected:any;
  page:any;
  pageRows:any;
  }
