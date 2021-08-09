import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../core/services/http/http.service';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { UnitOfMeasuremnet } from './unit-of-measurement.model';
import { environment } from '../../../../environments/environment';

import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasurementService extends AbstractRestService<UnitOfMeasuremnet> {
  loading: boolean;
  confirmationFlag = new BehaviorSubject(false);
  configFlag = this.confirmationFlag as Observable<boolean>;
  constructor(public httpService: HttpService,
    private bsModalService: BsModalService) {
    super(httpService);
  }

  getAll(): Observable<any> {
    return this.httpService.get(`${environment.uom_api_url}${environment.manageUom}`)
      .pipe(map(data => data));
  }
  getActiveUom(): Observable<any> {
    return this.httpService.get(`${environment.uom_api_url}${environment.manageUomGetActive}`)
      .pipe(map(data => data));
  }

  update(data: any): Observable<any> {
    return this.httpService.update(`${environment.uom_api_url}${environment.manageUom}`, data);
  }

  save(data: any): Observable<any> {
    return this.httpService.create(`${environment.uom_api_url}${environment.manageUom}`, data);
  }

  getById(id: number): Observable<any> {
    return this.httpService.get(`${environment.uom_api_url}${environment.manageUom}/${id}`);
  }

  findUnitOfMeasurement(technology: any) {
    return this.httpService.create(`${environment.uom_api_url}${environment.manageUom}/${environment.find}`, technology);
  }

  delete(id: any, sk: any) {
    return this.httpService.delete(`${environment.uom_api_url}${environment.manageUom}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  getUomGroupList(): Observable<any> {
    return this.httpService.get(`${environment.uom_api_url}${environment.manageUom}/${environment.groupName}`)
      .pipe(map(data => data));
  }
  modelConfirmation() {
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );

    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      this.sendConfirmationFlag(result);
    });
  }

  sendConfirmationFlag(flag: boolean) {
    this.confirmationFlag.next(flag);
  }
}
