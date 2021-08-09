import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LimsComponentModel } from './lims.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LimsService extends AbstractRestService<LimsComponentModel> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);

  }

  getById(id: number) {

    return this.httpService.get(environment.lims_analysis_api_url + environment.limsComponent + '/' + id)
      .pipe(map(data => data));
  }

  delete(lims: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(environment.lims_analysis_api_url + environment.limsComponent + '/' + environment.deleteLimsComponent, lims)
      .pipe(map(data => data));

  }
  findlims(lims: any) {

    return this.httpService.create(environment.lims_analysis_api_url + environment.limsComponent + '/' +
      environment.find, lims)
      .pipe(map(data => data));
  }


  getAllLims(lims) {
    return this.httpService.create(environment.lims_analysis_api_url + environment.limsComponent + '/' + environment.getLimsComponent, lims)
      .pipe(map(data => data));

  }

  save(lims: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(environment.lims_analysis_api_url + environment.limsComponent + '/' + environment.saveLimsComponent, lims)
      .pipe(map(data => data));
  }


  update(lims: any) {
    return this.httpService.update(environment.lims_analysis_api_url + environment.limsComponent, lims)
      .pipe(map(data => data));
  }


  getLimsOperationFlyOutData(lims) {
    return this.httpService.create(environment.lims_analysis_api_url + environment.limsComponent +
      '/' + environment.limsOperations, lims)
      .pipe(map(data => data));
  }
  getStandardComponentFlyOutDetails(operationName: any) {
    return this.httpService.create(environment.lims_analysis_api_url
      + environment.limsComponent + '/' + environment.LimsStandardComponents, operationName)
      .pipe(map(data => data));

  }
  getGroupNameOnOperationsDetails(groupId: any) {
    return this.httpService.get(environment.uom_api_url
      + environment.uomComponent + '/' + environment.GetUomsByGroup + '/' + groupId)
      .pipe(map(data => data));

  }
  findLimsOperationDetails(operationsData: any) {
    return this.httpService.create(environment.lims_analysis_api_url
      + environment.limsComponent + '/' + environment.findLIMSOperation, operationsData)
      .pipe(map(data => data));
  }
  findstandardDetails(standardData: any) {
    return this.httpService.create(environment.lims_analysis_api_url
      + environment.limsComponent + '/' + 'FindLIMSStandardComponent?operationName=' +
      standardData.limsOperation, standardData)
      .pipe(map(data => data));
  }
}
