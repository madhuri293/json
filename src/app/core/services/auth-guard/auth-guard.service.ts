import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboadrdService } from '../../../modules/dashboard/dashboadrd.service';
import { CommonService } from '../../../shared/common-services/common.service';
import { NotificationService } from '../notification/notification-service.service';
import { PathEnum } from '../../../shared/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  privilege: any;
  constructor(private commonService: CommonService,
    private readonly router: Router,
    private notify: NotificationService,
    private dashboardService: DashboadrdService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (localStorage.getItem('userObj')) {
      if (localStorage.getItem('privilege')) {
        this.privilege = JSON.parse(this.commonService.decrypt(localStorage.getItem('privilege')));
      }
      if (route.routeConfig.data.name === 'Dashboard') {
        return true;
      }
      if (this.privilege) {
        const permissionArray = this.privilege.filter(privilegeObj => privilegeObj.label === route.routeConfig.data.name);
        if (route.routeConfig.data.name === PathEnum.CALIBRATION) {
          const equipemntPermission = this.privilege.filter(privilegeObj => privilegeObj.label === PathEnum.EQUIPMENT);
          if ((equipemntPermission[0].children[1] && !equipemntPermission[0].children[1].isEnabled)) {
            this.router.navigate(['/dashboard']);
            this.notify.showWarning('You are not autorized to access the page');
            return false;
          } else {
            return true;
          }
        }
        if (route.routeConfig.data.name === PathEnum.MANAGEVARIABLE) {
          const manageVariablePermission = this.privilege.filter(privilegeObj => privilegeObj.label === PathEnum.UOMTEMPLATE);
          if ((manageVariablePermission[0].children[1] && !manageVariablePermission[0].children[1].isEnabled)) {
            this.router.navigate(['/dashboard']);
            this.notify.showWarning('You are not autorized to access the page');
            return false;
          } else {
            return true;
          }
        }

        if (permissionArray.length) {
          if ((permissionArray[0].label === route.routeConfig.data.name)) {
            if (!localStorage.getItem('technology')) {
              this.router.navigate(['/dashboard']);
              this.notify.showWarning('You are not autorized to access the page');
              return false;
            } else {
              if ((permissionArray[0].children[1] && !permissionArray[0].children[1].isEnabled)) {
                this.router.navigate(['/dashboard']);
                this.notify.showWarning('You are not autorized to access the page');
                return false;
              } else {
                return true;
              }
            }

          }
        }


        this.notify.showWarning('you are Not autorized to access the page');
        this.dashboardService.sendHideFlag(true);
        this.router.navigate(['/dashboard']);
        return false;

      } else {
        this.notify.showWarning('you are Not autorized to access the page');
        this.dashboardService.sendHideFlag(true);
        this.router.navigate(['/dashboard']);
        return false;

      }

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
