import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { CatalystFamily } from './catalyst-family.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalystFamilyService extends AbstractRestService<CatalystFamily> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }

  getById(id: number) {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystFamily}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: any, sk: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystFamily}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  findRole(catalyst: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystFamily}/${environment.find}`, catalyst)
      .pipe(map(data => data));
  }

  getAllCatalystFamily() {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystFamily}`)
      .pipe(map(data => data));
  }
  
  getAllActiveCatalystFamily() {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystFamilyActive}`)
      .pipe(map(data => data));
  }
  save(catalyst: any) {
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystFamily}`, catalyst)
      .pipe(map(data => data));
  }

  update(catalyst: any) {
    return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystFamily}`, catalyst)
      .pipe(map(data => data));
  }

  findActive(catalyst: any){
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystFamily}/${environment.FindActive}`, catalyst)
      .pipe(map(data => data));
  }

}
