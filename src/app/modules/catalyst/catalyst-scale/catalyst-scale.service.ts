import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { CatalystScale } from './catalyst-scale.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalystScaleService extends AbstractRestService<CatalystScale> {

  constructor(public httpService: HttpService) {
    super(httpService);

  }
  getById(id: number) {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystScale}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: number, skId: number) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystScale}/${id}/${skId}`)
      .pipe(map(data => data));
  }

  findRole(scale: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystScale}/${environment.find}` , scale)
      .pipe(map(data => data));
  }

  getAllCatalystScale() {
        // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystScale}`)
      .pipe(map(data => data));

  }
  getAllCatalystScaleActive() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystScale}/${environment.getActive}`)
      .pipe(map(data => data));

  }

  save(scale: any) {
        // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystScale}`, scale)
      .pipe(map(data => data));
  }

  update(scale: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystScale}`, scale)
      .pipe(map(data => data));
  }

}
