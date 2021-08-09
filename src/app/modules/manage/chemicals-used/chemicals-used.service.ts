import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { ManageChemicals } from './chemicals-used.model';


@Injectable({
  providedIn: 'root'
})
export class ChemicalsUsedService extends AbstractRestService<ManageChemicals> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }
  getAllManageChemicals() {
    return this.httpService.get(`${environment.chemichals_api_url}${environment.api_chemicals}`)
      .pipe(map(data => data));
  }
  getAllChemicalState() {
    return this.httpService.get(`${environment.chemichals_api_url}${environment.api_chemicals_state}`)
      .pipe(map(data => data));
  }
  getById(id: number) {
    return this.httpService.get(`${environment.chemichals_api_url}${environment.api_chemicals}/${id}`)
      .pipe(map(data => data));
  }
  find(checicals: any) {
    return this.httpService.create(`${environment.chemichals_api_url}${environment.api_chemicals}/${environment.find}`, checicals)
      .pipe(map(data => data));
  }
  save(chemical: any) {
    return this.httpService.create(`${environment.chemichals_api_url}${environment.api_chemicals}`, chemical)
      .pipe(map(data => data));
  }
  update(chemical: any) {
    return this.httpService.update(`${environment.chemichals_api_url}${environment.api_chemicals}`, chemical)
      .pipe(map(data => data));
  }
  delete(id: string, sk: string) {
    return this.httpService.delete(`${environment.chemichals_api_url}${environment.api_chemicals}/${id}/${sk}`)
      .pipe(map(data => data));
  }
}
