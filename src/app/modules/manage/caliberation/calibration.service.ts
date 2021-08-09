import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CalibrationService extends AbstractRestService<any> {
  equipmentData: any;
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }

  getById(id: string) {
    return this.httpService.get(`${environment.plants_api_url}${environment.equipmentCalibration}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: string, sk: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.plants_api_url}${environment.equipmentCalibration}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  find(query: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.plants_api_url}${environment.equipmentCalibration}/${environment.find}`, query)
      .pipe(map(data => data));
  }

  getAllCaliberation() {
    return this.httpService.get(`${environment.plants_api_url}${environment.equipmentCalibration}`)
      .pipe(map(data => data));
  }
  getAllCaliberationData(plantId: any, id: any) {
    return this.httpService.get(`${environment.plants_api_url}${environment.equipmentCalibration}/${environment.getCalibrationBYEquipment}/${plantId}/${id}`)
      .pipe(map(data => data));
  }

  save(plant: any) {
    return this.httpService.create(`${environment.plants_api_url}${environment.equipmentCalibration}`, plant)
      .pipe(map(data => data));
  }

  update(plant: any) {
    return this.httpService.update(`${environment.plants_api_url}${environment.equipmentCalibration}`, plant)
      .pipe(map(data => data));
  }

  getCaliberationFactorData() {
    return this.httpService.get(`${environment.plants_api_url}${environment.equipmentCalibration}/${environment.getCalibrationFactor}`)
      .pipe(map(data => data));
  }

}
