import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ManageAdsorbents } from './manage-adsorbents.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageAdsorbentsService extends AbstractRestService<ManageAdsorbents> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);

  }

  getAllAbsorbent() {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}`)
      .pipe(map(data => data));
  }
  getProductTypeDropDown() {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.productType}`)
      .pipe(map(data => data));
  }
  getProductSubTypeDropDown(productTypeId) {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.productSubType}/${productTypeId}`)
      .pipe(map(data => data));
  }
  getSampleTypeDropDown() {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.sampleType}`).pipe(map(data => data));
  }
  getbinderTypeDropDown() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.binderType}`)
      .pipe(map(data => data));
  }
  getSizeTypeDropDown() {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.adsorbentSize}`)
      .pipe(map(data => data));
  }

  getShapeTypeDropDown() {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.adsorbentShape}`)
      .pipe(map(data => data));
  }
  getHfrDropDown() {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.adsorbentHMIS}`)
      .pipe(map(data => data));
  }
  gethFrDropDown() {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.adsorbentHMIS}`)
      .pipe(map(data => data));
  }
  gethfRDropDown() {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.adsorbentHMIS}`)
      .pipe(map(data => data));
  }
  getConditionDropDown() {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.adsorbentCondition}`)
      .pipe(map(data => data));
  }

  getById(id: number) {

    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: any, sk: any) {
    return this.httpService.delete(`${environment.absorbent_api_url}${environment.absorbent}/${id}/${sk}`)
      .pipe(map(data => data));
  }
  findAdsorbenttData(val: any) {
    return this.httpService.create(`${environment.absorbent_api_url}${environment.absorbent}/${environment.find}`, val)
      .pipe(map(data => data));
  }


  getAllmanageAdsorbent() {
    return this.httpService.get(environment.catalyst_api_url + 'api/CatalystScale')
      .pipe(map(data => data));

  }


  save(manageAdsorbent: any) {
    return this.httpService.create(`${environment.absorbent_api_url}${environment.absorbent}`, manageAdsorbent)
      .pipe(map(data => data));
  }

  update(manageAdsorbent: any) {
    return this.httpService.update(`${environment.absorbent_api_url}${environment.absorbent}`, manageAdsorbent)
      .pipe(map(data => data));
  }
  getAllProductName() {
    return this.httpService.get(`${environment.absorbent_api_url}${environment.absorbent}/${environment.product}`)
      .pipe(map(data => data));
  }
  findProductData(val: any) {
    return this.httpService.create(`${environment.absorbent_api_url}${environment.absorbent}/${environment.findProduct}`, val)
      .pipe(map(data => data));
  }

}
