import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CatalystSize } from './catalyst-size.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CatalystSizeService extends AbstractRestService<CatalystSize> {
  constructor(public httpService: HttpService) {
    super(httpService);

  }
  getById(id: number) {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystSizes}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: number, skId: number) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystSizes}/${id}/${skId}`)
      .pipe(map(data => data));
  }

  findRole(catalystsize: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystSizes}/${environment.find}`
      , catalystsize)
      .pipe(map(data => data));
  }

  getAllCatalystSize() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystSizes}`)
      .pipe(map(data => data));
  }

  getAllActiveCatalystSize() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystSizes}/${environment.getActive}`)
      .pipe(map(data => data));
  }

  save(catalystsize: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystSizes}`, catalystsize)
      .pipe(map(data => data));
  }

  update(catalystsize: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystSizes}`, catalystsize)
      .pipe(map(data => data));
  }

}
