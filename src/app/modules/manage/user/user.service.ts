import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';

import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { CommonService } from '../../../shared/common-services/common.service';
@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractRestService<User> {
  loading: boolean;
  confirmationFlag = new BehaviorSubject(false);
  configFlag = this.confirmationFlag as Observable<boolean>;
  constructor(public httpService: HttpService,
    private bsModalService: BsModalService, private commonService: CommonService) {
    super(httpService);
  }

  getUsers(): Observable<any> {
    const userObj = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.user_api_url}${environment.manageUser}?${environment.superAdmin + userObj.isSuperAdmin}`)
      .pipe(map(data => data));
  }


  getDepartment(callback: (data) => void) {
    this.httpService.get(`${environment.user_api_url}${environment.Department}`).subscribe(result => {
      callback(result);
    });

  }
  save(user: any): Observable<any> {
    return this.httpService.create(`${environment.user_api_url}${environment.manageUser}`, user)
      .pipe(map(data => data));
  }
  find(user: any) {
    const userObj = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    return this.httpService.create(`${environment.user_api_url}${environment.manageUser}` + '/' +
      environment.find + '?' + environment.superAdmin + userObj.isSuperAdmin, user)
      .pipe(map(data => data));
  }

  update(user: any) {
    return this.httpService.update(`${environment.user_api_url}${environment.manageUser}`, user)
      .pipe(map(data => data));
  }
  delte(id: any, sk: any) {
    return this.httpService.delete(`${environment.user_api_url}${environment.manageUser}/${id}/${sk}`)
      .pipe(map(data => data));
  }

  getById(id: any) {
    return this.httpService.get(`${environment.user_api_url}${environment.manageUser}/${id}`)
      .pipe(map(data => data));
  }
  postUserTechnology(TechnologyRole: any) {
    return this.httpService.create(`${environment.user_api_url}${environment.manageUser}/${environment.technologyRole}`, TechnologyRole)
      .pipe(map(data => data));
  }

  getTechnicalTeamLead() {
    return this.httpService.get(`${environment.user_api_url}${environment.manageUser}/${environment.getTeamLeads}`).pipe(
      data => data
    );
  }

  findTeamLeads(user: any) {
    const userObj = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    return this.httpService.create(`${environment.user_api_url}${environment.manageUser}/${environment.find}?${userObj.isSuperAdmin}`, user)
      .pipe(map(data => data));
  }


  getTeamLead() {
    return this.httpService.get(`${environment.user_api_url}${environment.manageUser}/${environment.getTeamLeads}`).pipe(
      data => data
    );
  }

  findTeamLead(data: any) {
    return this.httpService.create(`${environment.user_api_url}${environment.manageUser}/${environment.findLead}`, data).pipe(
      result => result
    );
  }

  getSideMenu(techId: string, roleId: string) {
    return this.httpService.get(environment.user_api_url + 'api/UserPrivileges/GetMenuPrevilege' +
      '/' + techId + '/' + roleId);
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
  // end

  sendConfirmationFlag(flag: boolean) {
    this.confirmationFlag.next(flag);
  }
}

