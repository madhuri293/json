import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalystMainMastersService {
  loading: boolean;
  constructor(public httpService: HttpService) { }

  getCatalystMain(callback: (data) => void) {

    this.httpService.get(`${environment.catalyst_api_url}${environment.catalystMain}`)
      .subscribe(result => {
        callback(result);
      });
  }

  getStates(callback: (data) => void) {
    // tslint:disable-next-line:max-line-length
    this.httpService.get(`${environment.catalyst_api_url}${environment.catalystMain}/${environment.getStates}`)
      .subscribe(result => {
        callback(result);
      });
  }

  getActiveStates(callback: (data) => void) {
    this.httpService.get(environment.catalyst_api_url
      + environment.catalystState + '/' + environment.getActive)
      .subscribe(result => {
        callback(result);
      });
  }

  save(catalystMain: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystMain}`, catalystMain)
      .pipe(
        result => result
      );
  }

  update(catalystMain: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystMain}`, catalystMain)
      .pipe(
        result => result
      );
  }

  find(catalystMain: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystMain}/${environment.find}`, catalystMain)
      .pipe(
        result => result
      );
  }

  catalystMainById(id: any) {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystMain}/${id}`)
      .pipe(map(data => data));
  }

  getAlias(id: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystMain}/${environment.getAlias}?id=${id}`)
      .pipe(map(data => data));
  }

  delete(id: any, sk: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystMain}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  getFamily(id: number) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystMain}/${environment.getFamily}?id=${id}`)
      .pipe(map(data => data));
  }

  getFamily1(id: number) {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystFamily}/${id}`)
      .pipe(map(data => data));
  }

  getActiveCatalyst() {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystMain}/${environment.getActive}`)
      .pipe(map(data => data));
  }
}
