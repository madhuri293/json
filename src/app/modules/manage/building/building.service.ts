import { Injectable } from '@angular/core';


import { map } from 'rxjs/operators';

import { Building } from './building.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BuildingService extends AbstractRestService<Building> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }

  getById(id: number) {
    return this.httpService.get(`${environment.plants_api_url}${environment.building}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: number, sk: any) {
    return this.httpService.delete(`${environment.plants_api_url}${environment.building}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  findBuilding(role: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.plants_api_url}${environment.building}/${environment.find}`, role)
      .pipe(map(data => data));
  }

  getAllBuildingData() {
    return this.httpService.get(`${environment.plants_api_url}${environment.building}`)
      .pipe(map(data => data));
  }

  getAllBuildingDataByLocation(locationId: any) {
    return this.httpService.get(`${environment.plants_api_url}${environment.building}/${environment.getBuildingByLocationName}/${locationId}`)
      .pipe(map(data => data));
  }

  save(building: any) {
    return this.httpService.create(`${environment.plants_api_url}${environment.building}`, building)
      .pipe(map(data => data));
  }

  update(building: any) {
    return this.httpService.update(`${environment.plants_api_url}${environment.building}`, building)
      .pipe(map(data => data));
  }

}
