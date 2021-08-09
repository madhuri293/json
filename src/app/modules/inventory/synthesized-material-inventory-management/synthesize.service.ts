import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { Inventory } from '../Inventory.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SynthesizeService extends AbstractRestService<Inventory> {

  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }
  getAll(): Observable<any> {

    return this.httpService.get(environment.inventoryRawMaterial_api_url +
      environment.inventorySynthesizedMaterial)
      .pipe(map(data => data));
  }

  update(data: any): Observable<any> {
    return this.httpService.update(environment.inventoryRawMaterial_api_url +
      environment.inventorySynthesizedMaterial, data);
  }

  save(data: any): Observable<any> {
    return this.httpService.create(environment.inventoryRawMaterial_api_url +
      environment.inventorySynthesizedMaterial, data);
  }


  getById(id: string): Observable<any> {
    return this.httpService.get(environment.inventoryRawMaterial_api_url +
      environment.inventorySynthesizedMaterial + '/' + id);
  }

  findInventory(inventory: any) {
    return this.httpService.create(environment.inventoryRawMaterial_api_url +
      environment.inventorySynthesizedMaterial + '/' + environment.find, inventory);
  }


  delete(id: any, sk: any) {
    return this.httpService.delete(environment.inventoryRawMaterial_api_url
      + environment.inventorySynthesizedMaterial + '/' + id + '/' + sk)
      .pipe(map(data => data));
  }

  getRawMaterialName() {
    return this.httpService.get(environment.menu_api_url + 'api/inventory')
      .pipe(map(data => data));
  }
  getCatalystInventoryName() {
    return this.httpService.get(environment.menu_api_url + 'api/inventory')
      .pipe(map(data => data));
  }
  getSynthesizedMaterialName() {
    return this.httpService.get(environment.menu_api_url + 'api/inventory')
      .pipe(map(data => data));
  }
  getAllSynthesizedMaterials() {
    return this.httpService.get(environment.raw_material_url + environment.synthesizedActive)
      .pipe(map(data => data));
  }
}
