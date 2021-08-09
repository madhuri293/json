import { EntityModel } from '../../core/services/abstract-rest/abstract-rest.service';


export class User extends EntityModel {
    Email: string;
    Password: string;
    Token: string;
    toString(): string {
        return this.Email;
    }

}
