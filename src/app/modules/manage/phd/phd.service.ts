import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';

import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhdService {

  constructor(public http: HttpService) {
  }
  loading: boolean;

  getAll() {
    return this.http.get(`${environment.phd_api_url}${environment.phd}`)
      .pipe(map(data => data));
  }

  getPhdType() {
    return this.http.get(`${environment.phd_api_url}${environment.phdType}`)
      .pipe(map(data => data));
  }

  save(phdData: any) {
    return this.http.create(`${environment.phd_api_url}${environment.phd}`, phdData)
      .pipe(map(data => data));
  }

  update(phdData: any) {
    return this.http.update(`${environment.phd_api_url}${environment.phd}`, phdData)
      .pipe(map(data => data));
  }

  delete(id: number, sk: any) {
    return this.http.delete(`${environment.phd_api_url}${environment.phd}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  getById(id: number) {
    return this.http.get(`${environment.phd_api_url}${environment.phd}/${id}`)
      .pipe(map(data => data));
  }

  find(phd: any) {
    // tslint:disable-next-line:max-line-length
    return this.http.create(`${environment.phd_api_url}${environment.phd}/${environment.find}`, phd)
      .pipe(map(data => data));
  }
}
