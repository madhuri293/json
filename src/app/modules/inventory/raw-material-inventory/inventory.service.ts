import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Inventory } from '../Inventory.model';


@Injectable({
  providedIn: 'root'
})
export class InventoryService extends AbstractRestService<Inventory> {

  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }
  getAll(): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.inventoryRawMaterial_api_url}${environment.inventoryRawMaterial}`)
      .pipe(map(data => data));
  }

  update(data: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpService.update(`${environment.inventoryRawMaterial_api_url}${environment.inventoryRawMaterial}`, data);
  }

  save(data: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.inventoryRawMaterial_api_url}${environment.inventoryRawMaterial}`, data);
  }

  getById(id: string): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.inventoryRawMaterial_api_url}${environment.inventoryRawMaterial}/${id}`);
  }

  findInventory(inventory: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.inventoryRawMaterial_api_url}${environment.inventoryRawMaterial}/${environment.find}`, inventory);
  }

  delete(id: any, sk: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.inventoryRawMaterial_api_url}${environment.inventoryRawMaterial}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  getRawMaterialName() {
    return this.httpService.get(`${environment.menu_api_url}${environment.api_inventory}`)
      .pipe(map(data => data));
  }
  getCatalystInventoryName() {
    return this.httpService.get(`${environment.menu_api_url}${environment.api_inventory}`)
      .pipe(map(data => data));
  }

  getSynthesizedMaterialName() {
    return this.httpService.get(`${environment.menu_api_url}${environment.api_inventory}`)
      .pipe(map(data => data));
  }
}
