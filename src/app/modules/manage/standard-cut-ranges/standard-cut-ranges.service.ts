import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

import { CommonService } from '../../../shared/common-services/common.service';
import { BsModalService } from 'ngx-bootstrap';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { map } from 'rxjs/operators';
import { StandardCutRangeBP } from './standard-cut-ranges.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StandardCutRangesService extends AbstractRestService<StandardCutRangeBP> {
  configFlag1: boolean;
  loading: boolean;
  tempData:any= [];
  confirmationFlag = new BehaviorSubject(false);
  configFlag = this.confirmationFlag as Observable<boolean>;
  constructor(public httpService: HttpService,
    private commonService: CommonService,
    private bsModalService: BsModalService) {
    super(httpService);
  }


  save(data: any,productObjectiveId): Observable<any> {
    return this.httpService.create(`${environment.runObjectives_api_url}${environment.standardCutBoilingPoint}/${environment.updateBoilingPoints}/${productObjectiveId}`, data);
  }

  getById(id: number): Observable<any> {
    return this.httpService.get(`${environment.runObjectives_api_url}${environment.standardCutBoilingPoint}/${environment.getCutBolingPoints}/${id}`);
  }

  findRunObjective(technology: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.runObjectives_api_url}${environment.standardCutBoilingPoint}/${environment.find}`, technology);
  }

  delete(id: any,sk: any) {
    return this.httpService.delete(`${environment.runObjectives_api_url}${environment.standardCutBoilingPoint}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  sendConfirmationFlag(flag: boolean) {
    this.confirmationFlag.next(flag);
  }
}
