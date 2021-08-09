import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Plant } from './plant.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class PlantService extends AbstractRestService<Plant> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }

  getById(id: number) {
    return this.httpService.get(`${environment.plants_api_url}${environment.plants}/${id}`)
      .pipe(map(data => data));
  }

  delete(id: number, sk: any) {
    return this.httpService.delete(`${environment.plants_api_url}${environment.plants}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  findRole(plant: any) {
    return this.httpService.create(`${environment.plants_api_url}${environment.plants}/${environment.find}`, plant)
      .pipe(map(data => data));
  }

  getAllPlants() {
    return this.httpService.get(`${environment.plants_api_url}${environment.plants}`)
      .pipe(map(data => data));
  }
  getActivePlants() {
    return this.httpService.get(`${environment.plants_api_url}${environment.plants}/${environment.getActive}`)
    .pipe(map(data => data));
  }

  save(plant: any) {
    return this.httpService.create(`${environment.plants_api_url}${environment.plants}`, plant)
      .pipe(map(data => data));
  }

  update(plant: any) {
    return this.httpService.update(`${environment.plants_api_url}${environment.plants}`, plant)
      .pipe(map(data => data));
  }

  getAllLocationData() {
    return this.httpService.get(`${environment.plants_api_url}${environment.location}`)
    .pipe(map(data => data));
  }

  findActivePalnts(plant){
    return this.httpService.create(`${environment.plants_api_url}${environment.plants}/${environment.activePalnts}`, plant)
    .pipe(map(data => data));
  }

}
