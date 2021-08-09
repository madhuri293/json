import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { CatalystAlias } from './catalyst-alias-ss.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CatalystAliasService extends AbstractRestService<CatalystAlias> {

  constructor(public httpService: HttpService) {
    super(httpService);
  }

  getById(id: number) {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystAlias}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: number, skId: number) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystAlias}/${id}/${skId}`)
      .pipe(map(data => data));
  }

  findRole(alias: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystAlias}/${environment.find}`, alias)
      .pipe(map(data => data));
  }

  getAllCatalystAlias() {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystAlias}`)
      .pipe(map(data => data));
  }

  getAllActiveCatalystAlias() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystAlias}/${environment.getActive}` )
      .pipe(map(data => data));
  }

  save(alias: any) {
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystAlias}`, alias)
      .pipe(map(data => data));
  }

  update(alias: any) {
    return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystAlias}`, alias)
      .pipe(map(data => data));
  }
}
