import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { CatalystType } from './catalyst-type.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalystTypeService extends AbstractRestService<CatalystType> {
    constructor(public httpService: HttpService) {
      super(httpService);
  }

  getById(id: number) {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystType}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: number, sk: string) {
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystType}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  findRole(catalyst: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystType}/${environment.find}`, catalyst)
      .pipe(map(data => data));
  }

  getAllCatalystType() {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystType}`)
      .pipe(map(data => data));
  }

  getAllActiveCatalystType() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystType}/${environment.getActive}`)
      .pipe(map(data => data));
  }

  save(catalyst: any) {
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystType}`, catalyst)
      .pipe(map(data => data));
  }

  update(catalyst: any) {
    return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystType}`, catalyst)
      .pipe(map(data => data));
  }

  getApplicationDetails(id) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystApplicationByTypeId}/${id}`)
    .pipe(map(data => data));
  }

}
