import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

import { CommonService } from '../../../shared/common-services/common.service';
@Injectable({
  providedIn: 'root'
})
export class CatalystLoadingTemplateService {
  loading: boolean;

  constructor(private commonService: CommonService, public httpService: HttpService) { }


  getstatus(callback: (data) => void) {
    // tslint:disable-next-line:max-line-length
    this.httpService.get(`${environment.catalyst_api_url}${environment.catalystLoadingTemplate}/${environment.status}`)
      .subscribe(result => {
        callback(result);
      });
  }

  getTemplateLoading() {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystLoadingTemplate}`);
  }

  catalystLoadingTemplategetByID(id: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.catalyst_api_url}${environment.catalystLoadingTemplate}/${id}`)
      .pipe(map(data => data));
  }

  save(catalystLoading: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystLoadingTemplate}`, catalystLoading)
      .pipe(
        result => result
      );
  }

  update(catalystMain: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.update(`${environment.catalyst_api_url}${environment.catalystLoadingTemplate}`, catalystMain)
      .pipe(
        result => result
      );
  }

  find(catalystMain: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.catalystLoadingTemplate}/${environment.find}`, catalystMain)
      .pipe(
        result => result
      );
  }

  delete(id: any, sk: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.catalystLoadingTemplate}/${id}/${sk}`)
      .pipe(map(data => data));
  }

}
