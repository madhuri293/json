import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class Privilage extends EntityModel {
  TechnologyId: any;
  RoleId: any;
  toString(): string {
    throw new Error('Method not implemented.');
  }
}

export class Technology {
  technologyCode: string;
  colorCode: string;
  description: string;
  technologyName: string;
  id: string;
  status: any;
  sk: string;
}

export class Role {
  id: any;
  code: string;
  roleName: string;
  status: string;
  description: string;
  sk: string;
}

export interface MenuItem {
  id: string;
  name: string;
  children: MenuItem[];
}

export class SavePrivilege {
  TechnologyId: any;
  RoleId: any;
  PrevilegesList: any = [];
}


export class PrivilageDTO {
  privilageForm: FormGroup;
  roles: Role[];
  role: any;
  applications: Technology[];
  selectedRole: Role = null;
  selectedApplication: Technology;
  menu: MenuItem[];
  privilageTree: any | null = null;
  tree: any;
  unmodifiedData: any[] = [];
  privilege: any;

}

