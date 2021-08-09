import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { ManageUnitOps } from './manage-unit-ops.model';


@Injectable({
  providedIn: 'root'
})
export class ManageUnitOpsService extends AbstractRestService<ManageUnitOps> {

  constructor(public httpService: HttpService) {
    super(httpService);
  }
  getAllManageUnitOps() {
    return this.httpService.get(`${environment.unitOps_api_url}${environment.unitOperation}`)
      .pipe(map(data => data));
  }
  getById(id: number) {
    return this.httpService.get(`${environment.unitOps_api_url}${environment.unitOperation}/${id}`)
      .pipe(map(data => data));
  }
  find(unitOpsData: any) {
    return this.httpService.create(`${environment.unitOps_api_url}${environment.unitOpsFind}`, unitOpsData)
      .pipe(map(data => data));
  }
  save(unitOpsData: any) {
    return this.httpService.create(`${environment.unitOps_api_url}${environment.unitOperation}`, unitOpsData)
      .pipe(map(data => data));
  }
  update(unitOpsData: any) {
    return this.httpService.update(`${environment.unitOps_api_url}${environment.unitOperation}`, unitOpsData)
      .pipe(map(data => data));
  }
  delete(id: any, sk: any) {
    return this.httpService.delete(`${environment.unitOps_api_url}${environment.unitOperation}/${id}/${sk}`)
     .pipe(map(data => data));
  }
}
