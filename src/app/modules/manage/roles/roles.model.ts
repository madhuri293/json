import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';

export class Role extends EntityModel {
    code: string;
    description: string;
    roleName: string;
    status: string;
    sk: string;
}

export class Page {
    first = 0;
    page = 0;
    pageCount = 1;
    rows = 10;
}
export class Pagination {
    first: number;
}

export class RoleDTO {
    columns: { field: string; header: string; }[];
    value: any[];
    roles: any[];
    allRoles: any[];
    roleBeforeEdit: Role;
    roleForm: FormGroup;
    numberOfRecords: number;
    role: Role = new Role();
    statusList :any;
    disableReset = false;
    loading: boolean;
    roleList = [];
    statusClass: any;
    cols1: { field: string; header: string; }[];
    cars1: any[];
    buttonOpr = 'Save';
    roles1: { 'Name': string; 'Description': number; 'Status': string; }[];
    nOfRecordPage: number;
    totalRecords: any;
    roleId: any;
    skId: any;
    privilege: any;
    isDisabled: boolean;
}





