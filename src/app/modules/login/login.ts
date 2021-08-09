import { EntityModel } from '../../core/services/abstract-rest/abstract-rest.service';


export class Login extends EntityModel {
    userName: string;
    password: string;

}
