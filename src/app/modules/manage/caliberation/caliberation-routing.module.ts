import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CaliberationComponent } from './caliberation.component';
import { CalibrationService } from './calibration.service';

@Injectable({
  providedIn: 'root'
})
export class CaliberationFactorResolverService implements Resolve<any> {
  constructor(private api: CalibrationService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.api.getCaliberationFactorData();
  }
}


const routes: Routes = [{
  path: '',
  component: CaliberationComponent,
  resolve: { cfactor: CaliberationFactorResolverService }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaliberationRoutingModule { }
