import { Injectable } from '@angular/core';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { ReportsPlots } from './plots.model';
import { HttpService } from '../../../core/services/http/http.service';

import { CommonService } from '../../../shared/common-services/common.service';
import { BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlotsService extends AbstractRestService<ReportsPlots> {

  constructor(public httpService: HttpService,
    private commonService: CommonService,
    private bsModalService: BsModalService) {
    super(httpService);
  }

  getAll(): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.plot_api_url}${environment.plot}`)
      .pipe(map(data => data));
  }
 getAllplotsbytechnology(selectedTechnology: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.plot_api_url}${environment.plot}/${environment.getPlots_ByTechnology}/${selectedTechnology}`)
      .pipe(map(data => data));
  }  save(plot: any) {
    return this.httpService.create(`${environment.plot_api_url}${environment.plot}`
      , plot)
      .pipe(map(data => data));
  }
  update(plot: any) {
    return this.httpService.update(`${environment.plot_api_url}${environment.plot}`
      , plot)
      .pipe(map(data => data));
  }
  getById(id: number) {
    return this.httpService.get(`${environment.plot_api_url}${environment.plot}/${id}`
    )
      .pipe(map(data => data));
  }
  delete(id: number, sk: any) {
    return this.httpService.delete(`${environment.plot_api_url}${environment.plot}/${id}/${sk}`)
      .pipe(map(data => data));
  }
  findPlot(plot: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.plot_api_url}${environment.plot}/${environment.find}`
      , plot)
      .pipe(map(data => data));
  }
}
