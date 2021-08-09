import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonService } from '../../../shared/common-services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ManageVariableService extends AbstractRestService<any> {
  public loading;
  constructor(
    public httpService: HttpService, private commonService: CommonService) {
    super(httpService);
  }

  update(data: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpService.update(`${environment.uom_api_url}${environment.uomManageVariable}/${environment.updateManageTemplateVariable}`, data);
  }

  get() {
    return this.httpService.get(`${environment.uom_api_url}${environment.uomManageVariable}/${environment.uomVariableCategory}`)
      .pipe(map(data => data));
  }

  getUOMVariableList(templateId, categoryId, userId) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.uom_api_url}${environment.uomManageVariable}/${environment.manageVariableAsync}/${templateId}/${categoryId}/${userId}`).pipe(map(data => data));
  }
  getUOMListByCategoryAndVariable(category: any, variable: any) {
    // tslint:disable-next-line:max-line-length
    const user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    const templateId = localStorage.getItem('templateId');

    // tslint:disable-next-line: max-line-length
    return this.httpService.get(`${environment.uom_api_url}${environment.uomManageVariable}/${environment.getUOMUnits}/${user.userId}/${templateId}/${category}/${encodeURIComponent(variable)}`).pipe(map(data => data));
  }

  getUOMAllUOM() {
    return this.httpService.get(environment.uom_api_url + environment.manageUom + '/').pipe(map(data => data));
  }
}
