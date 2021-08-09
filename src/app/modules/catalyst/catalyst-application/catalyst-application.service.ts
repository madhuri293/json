import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';

import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalystApplicationService {
  loading: boolean;
  constructor(public httpService: HttpService) {

  }

  getById(id: number) {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystApplication}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: number, sk: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystApplication}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  find(alias: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystApplication}/${environment.find}`, alias)
      .pipe(map(data => data));
  }

  getAllCatalystApplication() {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystApplication}`)
      .pipe(map(data => data));
  }

  getAllActiveCatalystAlias() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystApplication}/${environment.getActive}`)
      .pipe(map(data => data));
  }

  save(alias: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystApplication}`, alias)
      .pipe(map(data => data));
  }

  update(alias: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystApplication}`, alias)
      .pipe(map(data => data));
  }
}
