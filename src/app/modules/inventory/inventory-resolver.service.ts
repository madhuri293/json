import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ManageVariableService } from '../manage/manage-variables/manage-variable.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryResolverService implements Resolve<any> {

  constructor(private manageVariableService: ManageVariableService) { }
  resolve(route: import('@angular/router').ActivatedRouteSnapshot, state: import('@angular/router').RouterStateSnapshot) {
    return this.manageVariableService.getUOMListByCategoryAndVariable('Catalyst Variables', 'Quantity');
  }
}
