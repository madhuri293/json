import { Injectable } from '@angular/core';


import { map } from 'rxjs/operators';
import { Role } from './roles.model';
import { HttpService } from '../../../core/services/http/http.service';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { environment } from '../../../../environments/environment';

import { CommonService } from '../../../shared/common-services/common.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends AbstractRestService<Role> {
  loading: boolean;
  configFlag1: boolean;
  confirmationFlag = new BehaviorSubject(false);
  configFlag = this.confirmationFlag as Observable<boolean>;
  constructor(public httpService: HttpService,
    private commonService: CommonService,
    private bsModalService: BsModalService
  ) {
    super(httpService);

  }

  getAllroles() {
    return this.httpService.get(`${environment.user_api_url}${environment.manageRoles}`)
      .pipe(map(data => data));
  }

  getAllActiveroles(){
    return this.httpService.get(`${environment.user_api_url}${environment.activeRole}`)
    .pipe(map(data => data));
  }


  save(role: any) {
    return this.httpService.create(`${environment.user_api_url}${environment.manageRoles}`, role)
      .pipe(map(data => data));
  }

  update(role: any) {
    return this.httpService.update(`${environment.user_api_url}${environment.manageRoles}`, role)
      .pipe(map(data => data));
  }
  delete(id: number, sk: any) {
    return this.httpService.delete(`${environment.user_api_url}${environment.manageRoles}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  getById(id: number) {
    return this.httpService.get(`${environment.user_api_url}${environment.manageRoles}/${id}`)
      .pipe(map(data => data));

  }

  findRole(role: any) {
    return this.httpService.create(`${environment.user_api_url}${environment.manageRoles}/${environment.find}`, role)
      .pipe(map(data => data));
  }

  modalConfirmation() {
    this.commonService.modelConfirmation();
    this.commonService.configFlag.subscribe(result => {
      this.configFlag1 = result;
    });
    return this.configFlag1;
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
