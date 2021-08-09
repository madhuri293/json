import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BuildingService } from '../building.service';
import { LocationService } from '../../location/location.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingResolverService implements Resolve<any> {
  buildingData: any;
  locationData: any;


  constructor(private buildingService: BuildingService, private locationService: LocationService) { }

  resolve(route: import('@angular/router').ActivatedRouteSnapshot, state: import('@angular/router').RouterStateSnapshot) {
    this.buildingData = this.buildingService.getAllBuildingData();
    this.locationData = this.locationService.getAllLocationData();
    return { buildingData: this.buildingData, locationData: this.locationData };
  }
}
