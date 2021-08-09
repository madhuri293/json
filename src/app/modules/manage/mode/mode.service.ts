import { Injectable } from '@angular/core';
import { Mode } from './mode.model';
import { map } from 'rxjs/operators';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModeService extends AbstractRestService<Mode> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);

  }
  getAllMode() {
    return this.httpService.get(`${environment.mode_api_url}${environment.api_Mode}`)
    .pipe(map(data => data));

  }
   
    getById(id: number) {
      return this.httpService.get(`${environment.mode_api_url}${environment.api_Mode}/${id}`)
      .pipe(map(data => data));
    }
    delete(id: number, skId: number) {
      return this.httpService.delete(`${environment.mode_api_url}${environment.api_Mode}/${id}/${skId}`)
      .pipe(map(data => data));
    }
  getProductObjective() {
    return this.httpService.get(`${environment.mode_api_url}${environment.api_ProductObjective}`)
      .pipe(map(data => data));
  }
  getControlMethod() {
    return this.httpService.get(`${environment.mode_api_url}${environment.api_ControlMethod}`)
      .pipe(map(data => data));
  }
  getSulfinding() {
    return this.httpService.get(`${environment.mode_api_url}${environment.api_Sulfinding}`)
      .pipe(map(data => data));
  }
  save(mode: any) {
    return this.httpService.create(`${environment.mode_api_url}${environment.api_Mode}`, mode)
      .pipe(map(data => data));
  }

  update(mode: any) {
    return this.httpService.update(`${environment.mode_api_url}${environment.api_Mode}`, mode)
      .pipe(map(data => data));
  }
  find(mode: any) {
    return this.httpService.create(`${environment.mode_api_url}${environment.api_Mode}/${environment.find}`, mode)
      .pipe(map(data => data));
  }
}
