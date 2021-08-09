import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { CatalystShape } from './catalyst-shape.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalystShapeService extends AbstractRestService<CatalystShape> {

  constructor(public httpService: HttpService) {
    super(httpService);
  }

  getById(id: number) {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystShape}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: number, skId: number) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystShape}/${id}/${skId}`)
      .pipe(map(data => data));
  }

  findRole(catalyst: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystShape}/${environment.find}`, catalyst)
      .pipe(map(data => data));
  }

  getAllCatalystShape() {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystShape}`)
      .pipe(map(data => data));
  }
  getAllActiveCatalystShape() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystShape}/${environment.getActive}`)
      .pipe(map(data => data));
  }

  getAllActiveCatalystShapeById(id: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystShape}/${environment.getActive}?id=${id}`)
      .pipe(map(data => data));
  }

  save(catalyst: any) {
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystShape}`, catalyst)
      .pipe(map(data => data));
  }

  update(catalyst: any) {
    return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystShape}`, catalyst)
      .pipe(map(data => data));
  }

}
