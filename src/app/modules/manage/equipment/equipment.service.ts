import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../core/services/http/http.service';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { environment } from '../../../../environments/environment';
import { Equipment } from './equipment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends AbstractRestService<Equipment> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }

  getEquipmentDetails() {
    return this.httpService.get(`${environment.plants_api_url}${environment.equipments}/${environment.getAllEquipmentType}`)
      .pipe(map(data => data));
  }
  getGetCalculationByEquipmentType(equipmentId: any) {
    return this.httpService.get(`${environment.plants_api_url}${environment.equipments}/${environment.getCalculationByEquipmentType}/${equipmentId}`)
      .pipe(map(data => data));
  }
  getCalculationDetails() {
    return this.httpService.get(`${environment.plants_api_url}${environment.equipments}/${environment.getAllCalculationModule}`)
      .pipe(map(data => data));
  }

  getVcfDetails() {
    return this.httpService.get(`${environment.plants_api_url}${environment.equipments}/${environment.getAllVCFType}`)
      .pipe(map(data => data));
  }

  getEquipmentGridDetails() {
    return this.httpService.get(`${environment.plants_api_url}${environment.equipments}`)
      .pipe(map(data => data));
  }

  getById(id: number) {
    return this.httpService.get(`${environment.plants_api_url}${environment.equipments}/${id}`)
      .pipe(map(data => data));
  }

  getCalibrationByEquipment(id: any) {
    return this.httpService.get(`${environment.plants_api_url}${environment.getCalibrationBYEquipment}/${id}`)
      .pipe(map(data => data));
  }

  update(equipment: any) {
    return this.httpService.update(`${environment.plants_api_url}${environment.equipments}`, equipment)
      .pipe(map(data => data));
  }

  save(equipment: any) {
    return this.httpService.create(`${environment.plants_api_url}${environment.equipments}`, equipment)
      .pipe(map(data => data));
  }

  delete(id: number, sk: any) {
    return this.httpService.delete(`${environment.plants_api_url}${environment.equipments}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  findEquipment(equipment: any) {
    return this.httpService.create(`${environment.plants_api_url}${environment.equipments}/${environment.find}`, equipment)
      .pipe(map(data => data));
  }

}
