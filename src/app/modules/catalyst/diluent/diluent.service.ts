import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiluentService {

  constructor(public httpService: HttpService) { }

  delte(id: any, sk: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystDiluents}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  getSizeData() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystDiluents}/${environment.catalystDulientSize}`)
      .pipe(map(data => data));
  }

  getActiveSizeData() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystSizes}/${environment.getActive}`)
      .pipe(map(data => data));
  }

  getdiluent() {
    // tslint:disable-next-line:max-line-length
   return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystDiluents}`)
      .pipe(map(data => data));
  }

  getdiluentRecord(id: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystDiluents}/${id}`)
      .pipe(map(data => data));
  }

  save(diluent: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystDiluents}`, diluent)
      .pipe(map(data => data));
  }

  update(diluent: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystDiluents}`, diluent)
      .pipe(map(data => data));
  }

  find(diluent: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystDiluents}/${environment.find}`, diluent)
      .pipe(map(data => data));
  }

  getAllCatalystSize() {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystDiluents}/${environment.GetDiluentSize}` )
      .pipe(map(data => data));
  }
  getAllActiveDiluent() {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystDiluents}/${environment.getActive}` )
      .pipe(map(data => data));
  }
  findActive(diluent: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystDiluents}/${environment.FindActive}`, diluent)
      .pipe(map(data => data));
  }

}
