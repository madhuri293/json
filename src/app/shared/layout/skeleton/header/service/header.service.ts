import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private toggleFlag = new BehaviorSubject(false);
  sendFlag = this.toggleFlag as Observable<any>;

  private loadSideMenu$ = new BehaviorSubject(false);
  sendLoadMenuFlag = this.loadSideMenu$ as Observable<any>;
  constructor() { }

  sendToggleFlag(flag: boolean) {
    this.toggleFlag.next(flag);
  }

  sendSideMenuFlag(flag: boolean) {
    this.loadSideMenu$.next(flag);
  }
}
