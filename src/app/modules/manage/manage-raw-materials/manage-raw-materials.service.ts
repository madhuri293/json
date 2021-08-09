import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { map } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { ManageRawMaterials } from './manage-raw-materials.model';

@Injectable({
  providedIn: 'root'
})
export class ManageRawMaterialsService extends AbstractRestService<ManageRawMaterials> {
  loading: boolean;
  constructor(public httpService: HttpService) {
    super(httpService);
  }

  getAllRawMaterials() {
    return this.httpService.get(`${environment.raw_material_url}${environment.manageRawMaterial}`)
      .pipe(map(data => data));
  }
  getAllManageRawMaterials() {
    return this.httpService.get(`${environment.raw_material_url}${environment.rawMaterialStateActive}`)
      .pipe(map(data => data));
  }

  getAllRawMaterialState() {
    return this.httpService.get(`${environment.raw_material_url}${environment.rawMaterialState}`)
      .pipe(map(data => data));

  }
  getById(id: number) {
    return this.httpService.get(`${environment.raw_material_url}${environment.manageRawMaterial}/${id}`)
      .pipe(map(data => data));
  }
  find(rawmaterial: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.raw_material_url}${environment.manageRawMaterial}/${environment.find}`, rawmaterial)
      .pipe(map(data => data));
  }
  save(rawmaterial: any) {
    return this.httpService.create(`${environment.raw_material_url}${environment.manageRawMaterial}`,
      rawmaterial)
      .pipe(map(data => data));
  }
  update(rawmaterial: any) {
    return this.httpService.update(`${environment.raw_material_url}${environment.manageRawMaterial}`,
      rawmaterial)
      .pipe(map(data => data));
  }
  delete(id: string, sk: string) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.delete(`${environment.raw_material_url}${environment.manageRawMaterial}/${id}/${sk}`).pipe(map(data => data));
  }
  flyoutfind(rawmaterial: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.raw_material_url}${environment.manageRawMaterial}/${environment.FindActiveMaterial}`, rawmaterial)
      .pipe(map(data => data));
  }
}
