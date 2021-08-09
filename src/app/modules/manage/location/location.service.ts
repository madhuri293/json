import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Location } from './location.model';
import { HttpService } from '../../../core/services/http/http.service';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LocationService extends AbstractRestService<Location> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }

  getById(id: number) {
    return this.httpService.get(`${environment.plants_api_url}${environment.location}/${id}`)
    .pipe(map(data => data));
  }

  delete(id: number, sk: any) {
    return this.httpService.delete(`${environment.plants_api_url}${environment.location}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  findLocation(location: any) {
    return this.httpService.create(`${environment.plants_api_url}${environment.location}/${environment.find}`, location)
      .pipe(map(data => data));
  }

  getAllLocationData() {
    return this.httpService.get(`${environment.plants_api_url}${environment.location}`)
    .pipe(map(data => data));
  }
  getActiveLocationData() {
    return this.httpService.get(`${environment.plants_api_url}${environment.location}/${environment.getActive}`)
    .pipe(map(data => data));
  }

  save(location: any) {
    return this.httpService.create(`${environment.plants_api_url}${environment.location}`, location)
      .pipe(map(data => data));
  }

  update(location: any) {
    return this.httpService.update(`${environment.plants_api_url}${environment.location}`, location)
      .pipe(map(data => data));
  }

}
