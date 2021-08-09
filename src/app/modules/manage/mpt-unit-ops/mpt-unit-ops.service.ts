import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MptUnitOps } from './mpt-unit-ops.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class MptUnitOpsService extends AbstractRestService<MptUnitOps> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);

  }


  getAllMptUnits() {
    return this.httpService.get(`${environment.unitOps_api_url}${environment.mptUnitOps}`)
      .pipe(map(data => data));

  }

  getActiveUnitOperations() {
    return this.httpService.get(`${environment.unitOps_api_url}${environment.mptUnitOps}/${environment.activeUnitOperations}`)
     .pipe(map(data => data));
  }

  save(mptOpsData: any) {
    return this.httpService.create(`${environment.unitOps_api_url}${environment.mptUnitOps}`, mptOpsData)
      .pipe(map(data => data));
  }


}
