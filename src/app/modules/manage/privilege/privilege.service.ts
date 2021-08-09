import { Injectable } from '@angular/core';
import { Privilage, MenuItem } from './priviege.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../shared/common-services/common.service';


@Injectable({
  providedIn: 'root'
})
export class PrivilegeService extends AbstractRestService<Privilage> {
  loading: boolean;
  constructor(public httpService: HttpService, public commonService: CommonService) {
    super(httpService);
  }

  getAllroles() {
    return this.httpService.get(environment.user_api_url + environment.activeRole)
      .pipe(map(data => data));
  }
  getMenu(techId: any, roleId: any): Observable<MenuItem[]> {
    return this.httpService.get(environment.user_api_url + environment.managePrivileges
      + '/' + techId + '/' + roleId)
      .pipe(map(result => result.data));
  }

  savePrivilage(privilege: any): Observable<any> {

    return this.httpService.create(environment.user_api_url + environment.managePrivileges, privilege)
      .pipe(map(data => data));
  }

}
