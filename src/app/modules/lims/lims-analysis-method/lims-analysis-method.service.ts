import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { map } from 'rxjs/operators';
import { LimsAnalysisModel } from './lims-analysis-method.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LimsAnalysisMethodService extends AbstractRestService<LimsAnalysisModel> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);

  }
  getUomGroupList(): Observable<any> {
    return this.httpService.get(environment.uom_api_url + environment.manageUom + '/' +
      environment.groupName)
      .pipe(map(data => data));
  }
  getLIMSAnalysisData(dataIn: any) {
    return this.httpService.create(environment.lims_analysis_api_url + environment.analysisMethod + '/' +
      environment.getLIMSAnalysisMethodData, dataIn)
      .pipe(map(data => data));
  }
  getById(id: number) {
    return this.httpService.get(environment.lims_analysis_api_url + environment.limsAnalysis + '/' + id)
      .pipe(map(data => data));
  }
  getAllByMethodName(limsAnalysis: any) {
    return this.httpService.create(environment.lims_analysis_api_url + environment.analysisMethod + '/' +
      environment.getAnalysisMethodByNameAsync + '/' + limsAnalysis, '').pipe(map(data => data));
  }
  delete(dataToDelete: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(environment.lims_analysis_api_url + environment.analysisMethod + '/' + environment.deleteMethodData, dataToDelete)
      // tslint:disable-next-line:no-shadowed-variable
      .pipe(map(data => data));

  }
  find(limsAnalysis: any) {
    return this.httpService.create(environment.lims_analysis_api_url + environment.analysisMethod + '/' +
      environment.getLIMSAnalysisMethodData, limsAnalysis)
      .pipe(map(data => data));
  }


  getAllLims() {
    return this.httpService.get(environment.lims_analysis_api_url + environment.limsAnalysis)
      .pipe(map(data => data));

  }

  save(lims: any) {
    return this.httpService.create(environment.lims_analysis_api_url + environment.analysisMethod + '/' +
      environment.saveLIMSAnalysisMethodData, lims)
      .pipe(map(data => data));
  }


  update(lims: any) {
    return this.httpService.create(environment.lims_analysis_api_url + environment.analysisMethod + '/' +
      environment.saveLIMSAnalysisMethodData, lims)
      .pipe(map(data => data));
  }

  getSourceNameList() {
    return this.httpService.get(environment.lims_analysis_api_url
      + environment.analysisMethod + '/' + environment.getLimsSources)
      .pipe(map(data => data));

  }
  findLimsOperationDetails(operationsData: any) {
    return this.httpService.get(environment.lims_analysis_api_url
      + '/' + environment.limsComponent + '/' + environment.findLIMSOperation + operationsData)
      .pipe(map(data => data));
  }
}
