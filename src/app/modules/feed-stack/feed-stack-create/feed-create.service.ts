import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class FeedCreateService extends AbstractRestService<any> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }
  getById(uop: any) {
    return this.httpService.get(`${environment.feedCreate_api_url}${environment.feed_api}${uop}`)
      .pipe(map(data => data));
  }
  getByCategoryId(categoryId: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.feedCreate_api_url}${environment.feed}/GetFeedSubCategory?CategoryId=${categoryId}`)
      .pipe(map(data => data));
  }
  getAllFeeds() {
    return this.httpService.get(`${environment.feedCreate_api_url}${environment.feed}`)
      .pipe(map(data => data));
  }
  getAllCustomerData() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.feedCreate_api_url}${environment.feed}/${environment.customer}`
    )
      .pipe(map(data => data));
  }
  getEditedRecordById(id) {
    return this.httpService.get(`${environment.feedCreate_api_url}${environment.feed}/${id}`)
      .pipe(map(data => data));
  }

  getFeedType() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.feedCreate_api_url}${environment.feed}/${environment.feedType}`
    )
      .pipe(map(data => data));
  }

  getCategoryType() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.feedCreate_api_url}${environment.feed}/${environment.feedCategory}`
    )
      .pipe(map(data => data));
  }

  findFeedData(val: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.feedCreate_api_url}${environment.feed}/${environment.find}`
      , val)
      .pipe(map(data => data));
  }
  findCustomerData(val: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.feedCreate_api_url }${environment.feed}/${environment.findCustomer}`
     , val)
      .pipe(map(data => data));
  }
  save(feedData: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.feedCreate_api_url}${environment.feed}`, feedData)
      .pipe(map(data => data));
  }


  update(feedData: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.update(`${environment.feedCreate_api_url}${environment.feed}`, feedData)
      .pipe(map(data => data));
  }
  getStatus() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.feedCreate_api_url}${environment.feed}/${environment.feedStatus}`
      )
      .pipe(map(data => data));
  }
  delete(id: number, sk: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.feedCreate_api_url}${environment.feed}/${id}/${sk}`)
      .pipe(map(data => data));

  }
}
