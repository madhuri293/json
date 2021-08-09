import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';

import { CommonService } from '../../../shared/common-services/common.service';
import { BsModalService } from 'ngx-bootstrap';
import { ReportsCharts } from './charts.model';
@Injectable({
  providedIn: 'root'
})
export class ChartsService extends AbstractRestService<ReportsCharts> {

  constructor(public httpService: HttpService,
    private commonService: CommonService,
    private bsModalService: BsModalService) {
    super(httpService);
  }
  getAll(): Observable<any> {
    // tslint:disable-next-line:max-line-length
         return this.httpService.get(`${environment.chart_api_url}${environment.chart}`)
      .pipe(map(data => data));
  }
  getAllChartsbytechnology(selectedTechnology: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.chart_api_url}${environment.chart}/${environment.getCharts_ByTechnology}/${selectedTechnology}`)
      .pipe(map(data => data));
  }
  save(chart: any) {
    return this.httpService.create(`${environment.chart_api_url}${environment.chart}`, chart)
      .pipe(map(data => data));
  }
  update(chart: any) {
    return this.httpService.update(`${environment.chart_api_url}${environment.chart}`, chart)
      .pipe(map(data => data));
  }
  getById(id: number) {
      return this.httpService.get(`${environment.chart_api_url}${environment.chart}/${id}`)
       .pipe(map(data => data));
  }
  delete(id: number, sk: any) {
    return this.httpService.delete(`${environment.chart_api_url}${environment.chart}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  findChart(chart: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.chart_api_url}${environment.chart }/${environment.find}`
     , chart)
      .pipe(map(data => data));
  }
}
