import { Injectable } from '@angular/core';
import { UomTemplate } from './uom-template.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';

import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UomTemplateService extends AbstractRestService<UomTemplate> {
  public templateId;
  public name: any;
  loading: boolean;

  confirmationFlag = new BehaviorSubject(false);
  configFlag = this.confirmationFlag as Observable<boolean>;

  constructor(public httpService: HttpService,
    private bsModalService: BsModalService) {
    super(httpService);
  }
  getAll(): Observable<any> {
    return this.httpService.get(`${environment.uom_api_url}${environment.manageUomTemplate}`)
      .pipe(map(data => data));
  }

  update(data: any): Observable<any> {
    return this.httpService.update(`${environment.uom_api_url}${environment.manageUomTemplate}`, data);
  }

  save(data: any): Observable<any> {
    return this.httpService.create(`${environment.uom_api_url}${environment.manageUomTemplate}`, data);
  }

  getById(id: number): Observable<any> {
    return this.httpService.get(`${environment.uom_api_url}${environment.manageUomTemplate}/${id}`);
  }

  findUomTemplate(technology: any) {
    return this.httpService.create(`${environment.uom_api_url}${environment.manageUomTemplate}/${environment.find}`, technology);
  }

  delete(id: any, sk: any) {
    return this.httpService.delete(`${environment.uom_api_url}${environment.manageUomTemplate}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  saveUserTemplate(userId: any, templeteId: any) {
    return this.httpService.get(`${environment.uom_api_url}${environment.manageUomDefaultTemplate}/${userId}/${templeteId}`);
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

  getTemplateId(userId) {
    return this.httpService.get(environment.uom_api_url + environment.manageUomTemplate + '/' + environment.defaultUserTemplate + '/' + userId);

  }
}
