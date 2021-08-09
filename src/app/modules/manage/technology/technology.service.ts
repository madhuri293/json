import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Technology } from './technology.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';

import { CommonService } from '../../../shared/common-services/common.service';
import { BsModalService } from 'ngx-bootstrap';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TechnologyService extends AbstractRestService<Technology> {
  loading: boolean;
  configFlag1: boolean;
  confirmationFlag = new BehaviorSubject(false);
  configFlag = this.confirmationFlag as Observable<boolean>;
  constructor(public httpService: HttpService,
    private commonService: CommonService,
    private bsModalService: BsModalService) {
    super(httpService);
  }
  getAll(): Observable<any> {
    return this.httpService.get(`${environment.menu_api_url}${environment.manageTechnology}`)
      .pipe(map(data => data));
  }

  getAllActive(): Observable<any> {
    return this.httpService.get(`${environment.menu_api_url}${environment.activeTechnology}`)
      .pipe(map(data => data));
  }

  update(data: any): Observable<any> {
    return this.httpService.update(`${environment.menu_api_url}${environment.manageTechnology}`, data);
  }

  save(data: any): Observable<any> {
    return this.httpService.create(`${environment.menu_api_url}${environment.manageTechnology}`, data);
  }

  getById(id: number): Observable<any> {
    return this.httpService.get(`${environment.menu_api_url}${environment.manageTechnology}` + '/' + id);
  }

  findTechnology(technology: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.menu_api_url}${environment.manageTechnology}/${environment.find}`, technology);
  }

  delete(id: any, sk: any) {
    return this.httpService.delete(`${environment.menu_api_url}${environment.manageTechnology}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  sendConfirmationFlag(flag: boolean) {
    this.confirmationFlag.next(flag);
  }
}
