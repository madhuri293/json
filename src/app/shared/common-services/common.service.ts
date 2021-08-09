import { Injectable } from '@angular/core';
import { StatusEnum, DeleteMessageEnum } from '../enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../core/custom-modal/custom-modal.component';
import { BehaviorSubject, Observable } from 'rxjs';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  confirmationFlag = new BehaviorSubject(false);
  configFlag = this.confirmationFlag as Observable<boolean>;

  currentId = new BehaviorSubject(null);
  deletionId = this.currentId as Observable<any>;

  private loadComponent$ = new BehaviorSubject(false);
  loadComponent = this.loadComponent$ as Observable<any>;

  modelFlag: boolean;
  privilege: any;
  flag: boolean;
  secret_key: string;
  statusFlag: boolean;
  statusList: { id: StatusEnum; status: StatusEnum; }[];
  diluentStatusList: { id: StatusEnum; status: StatusEnum; }[];


  constructor(private bsModalService: BsModalService) {
    this.secret_key = '2f77668a9dfbf8d5848b9eeb4a7145ca94c6ed9236e4a773f6dcafa5132b2f91';


  }
  encrypt(value: any) {
    return CryptoJS.AES.encrypt(value, this.secret_key.trim()).toString();
  }

  decrypt(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.secret_key.trim()).toString(CryptoJS.enc.Utf8);
  }

  getStatus(statusObj: any) {
    if (statusObj.status === StatusEnum.Y) {
      return statusObj.status = StatusEnum.ACTIVE;
    } else {
      return statusObj.status = StatusEnum.INACTIVE;

    }
  }

  getStatusList() {
    return this.statusList = [{ id: StatusEnum.Y, status: StatusEnum.ACTIVE },
    { id: StatusEnum.N, status: StatusEnum.INACTIVE }];
  }


  getDiluentStatusList() {
    return this.diluentStatusList = [{ id: StatusEnum.Y, status: StatusEnum.YES },
    { id: StatusEnum.N, status: StatusEnum.NO }];
  }

  getStatusToFind(statusObj: any) {
    if (statusObj.status === StatusEnum.ACTIVE) {
      return statusObj.status = StatusEnum.Y;
    } else {
      return statusObj.status = StatusEnum.N;

    }
  }
  getStatusTemp(statusObj: any) {
    if (statusObj.status === StatusEnum.Y) {
      return statusObj.status = StatusEnum.ACTIVE;
    } else {
      return statusObj.status = StatusEnum.INACTIVE;

    }
  }
  getStatusToFindTemp(statusObj: any) {
    if (statusObj.status === StatusEnum.ACTIVE) {
      return statusObj.status = StatusEnum.Y;
    } else {
      return statusObj.status = StatusEnum.N;

    }
  }
  getReferenceTemp(statusObj: any) {
    if (statusObj.diluentInd === StatusEnum.YES) {
      return statusObj.diluentInd = StatusEnum.Y;
    } else {
      return statusObj.diluentInd = StatusEnum.N;

    }
  }

  getReferenceToFindTemp(statusObj: any) {
    if (statusObj.diluentInd === StatusEnum.Y) {
      return statusObj.diluentInd = StatusEnum.YES;
    } else {
      return statusObj.diluentInd = StatusEnum.NO;

    }
  }

  getBaseUnitStatus(statusObj: any) {
    if (statusObj.baseUnitStatus === StatusEnum.Y) {
      return statusObj.baseUnitStatus = StatusEnum.YES;
    } else {
      return statusObj.baseUnitStatus = StatusEnum.NO;

    }
  }

  getSulfidingStatus(statusObj: any) {
    if (statusObj.sulfidingStatus === StatusEnum.YES) {
      return statusObj.sulfidingStatus = StatusEnum.Y;
    } else {
      return statusObj.sulfidingStatus = StatusEnum.N;

    }
  }

  getSulfidingStatusList(statusObj: any) {
    if (statusObj.sulfidingStatus === StatusEnum.Y) {
      return statusObj.sulfidingStatus = StatusEnum.YES;
    } else {
      return statusObj.sulfidingStatus = StatusEnum.NO;

    }
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

  sendCurrentId(id: any) {
    this.currentId.next(id);
  }

  applyPrivilege(pathName: string) {
    this.privilege = JSON.parse(this.decrypt(localStorage.getItem('privilege')));

    const path = this.privilege.filter(res => res.label === pathName);
    if (path.length) {
      if (path[0].children[0]) {
        this.flag = path[0].children[0].isEnabled;
        return this.flag;
      }
    }

    return false;


  }


  public toggleFlag = new BehaviorSubject(false);
  sendFlag = this.toggleFlag as Observable<any>;
  sendToggleFlag(flag: boolean) {
    this.toggleFlag.next(flag);
  }

  private toggleFlagFind = new BehaviorSubject(false);
  sendFlagFind = this.toggleFlagFind as Observable<any>;
  sendToggleFlagFind(flag: boolean) {
    this.toggleFlagFind.next(flag);
  }

  canReloadComponent(flag: boolean) {
    this.loadComponent$.next(flag);
  }
}
