import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CatalystStateService {

  constructor(public httpService: HttpService) { }

    getAllCatalystState() {
      return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystState}`)
        .pipe(map(data => data));
    }

    getById(id: number) {
      // tslint:disable-next-line:max-line-length
      return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystState}/${id}`)
        .pipe(map(data => data));
    }

    find(catalyst: any) {
      // tslint:disable-next-line:max-line-length
      return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystState}/${environment.find}` , catalyst)
        .pipe(map(data => data));
    }

    save(catalyst: any) {
      // tslint:disable-next-line:max-line-length
      return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystState}`, catalyst)
        .pipe(map(data => data));
    }

    update(catalyst: any) {
      // tslint:disable-next-line:max-line-length
      return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystState}`, catalyst)
        .pipe(map(data => data));
    }

    delete(id: number, sk: any) {
      // tslint:disable-next-line:max-line-length
      return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystState}/${id}/${sk}`)
        .pipe(map(data => data));
    }

}
