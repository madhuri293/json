import { Injectable } from '@angular/core';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { Inventory } from '../Inventory.model';
import { HttpService } from '../../../core/services/http/http.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CatalystInventoryServiceService extends AbstractRestService<Inventory> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }
  getAll(): Observable<any> {


    return this.httpService.get(`${environment.catalyst_api_url}${environment.inventory}`)
      .pipe(map(data => data));
  }

  update(data: any): Observable<any> {
    return this.httpService.update(`${environment.catalyst_api_url}${environment.inventory}`, data);
  }

  save(data: any): Observable<any> {
    return this.httpService.create(`${environment.catalyst_api_url}${environment.inventory}`, data);
  }

  getById(id: string): Observable<any> {
    return this.httpService.get(`${environment.catalyst_api_url}${environment.inventory}/${id}`);
  }

  findInventory(inventory: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.catalyst_api_url}${environment.inventory}/${environment.find}` , inventory);
  }

  delete(id: any, sk: any) {
    return this.httpService.delete(`${environment.catalyst_api_url}${environment.inventory}/${id}/${sk}`)
      .pipe(map(data => data));
  }

}
