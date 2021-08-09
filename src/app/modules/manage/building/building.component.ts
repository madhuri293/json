import { Component, OnInit } from '@angular/core';
import { Building, BuildingDTO } from './building.model';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import { BuildingService } from './building.service';
import { LocationService } from '../location/location.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { ActivatedRoute } from '@angular/router';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { BehaviorSubject } from 'rxjs';
import {  DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html'
})
export class BuildingComponent implements OnInit {

  building: Building = new Building();

  buildingDTO: BuildingDTO = new BuildingDTO();

  constructor(private formBuilder: FormBuilder, private locationService: LocationService, private commonService: CommonService,
    private bsModalService: BsModalService, public buildingService: BuildingService,
    private notify: NotificationService, private dashboardService: DashboadrdService,
    private router: ActivatedRoute
  ) {
    this.buildingDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.buildingService.loading = true;
    this.dashboardService.showTechnologyHeader = false;
    this.getBuildingList();
    this.getLocation();
    this.buildingDTO.nOfRecordPage = 10;
    this.buildingFromControls();
    this.buildingDTO.columns = [
      { field: 'locationName', header: 'Location Name' },
      { field: 'buildingNumber', header: 'Building Number' },
      { field: 'status', header: 'Status' },
    ];
    if (this.buildingDTO.privilege) {
      this.buildingDTO.columns.push({ field: 'Action', header: 'Action' });
    }
    this.buildingDTO.statusList = this.commonService.getStatusList();
  }

  buildingFromControls() {
    this.buildingDTO.buildingForm = this.formBuilder.group(
      {
        location: new FormControl('', Validators.compose([Validators.required])),
        buildingNumber: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(30),
        Validators.pattern(SPACE_REGEXP)])),
        status: new FormControl('', Validators.compose([Validators.required]))
      }
    );

  }



  saveBuildingData(building: any) {
    this.buildingDTO.isDisabled = true;
    if (building.id) {
      this.buildingService.update(building).subscribe(result => {
        this.buildingDTO.isDisabled = false;
        this.buildingDTO.totalRecords = 0;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();

      },
        (error) => {
          this.buildingDTO.isDisabled = false;
          this.notify.showError(error.message);
        });

    } else {
      this.buildingService.save(building).subscribe(result => {
        this.buildingDTO.isDisabled = false;
        this.buildingDTO.totalRecords = 0;

        this.notify.showSuccess(result.body.message);
        this.onResetClick();
      }, (error) => {
        this.buildingDTO.isDisabled = false;
        this.notify.showError(error.message);
      });
    }

  }
  getBuildingList() {
    this.buildingService.loading = true;
    this.buildingService.getAllBuildingData().subscribe(result => {
      if (result.data !== null) {
        result.data.forEach(data => {
          data.status = this.commonService.getStatus(data);
        });
        this.buildingDTO.rows = result.data;
        this.buildingDTO.totalRecords = this.buildingDTO.rows.length;
        this.buildingDTO.numberOfRecords = this.buildingDTO.rows.length;
      }

      this.buildingService.loading = false;
    },
      (error) => {
        this.buildingService.loading = false;
      });
  }

  onResetClick() {
    this.buildingDTO.totalRecords = 0;
    this.building = new Building();
    this.buildingDTO.buildingForm.reset();
    this.getBuildingList();
    this.commonService.sendToggleFlag(true);

  }
  onRoleEditClick(data: any) {
    this.buildingDTO.isDisabled = false;
    this.buildingService.getById(data.id).subscribe(location => {
      this.building = location.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  changeLocation(location: any) {
    this.buildingDTO.locationData = this.buildingDTO.locationList.filter(locationObj => locationObj.id === location);
    this.building.locationId = this.buildingDTO.locationData[0].id;
  }


  find(buildingData: any) {
    this.buildingDTO.rows = [];
    this.buildingDTO.totalRecords = 0;
    this.buildingService.loading = true;
    this.buildingDTO.totalRecords = 0;

    this.buildingService.findBuilding(buildingData).subscribe(result => {
      this.buildingDTO.rows = result.body.data;
      this.buildingDTO.buildingList = this.buildingDTO.rows;
      this.commonService.sendToggleFlag(true);

      this.buildingDTO.buildingList.forEach(data => {
        this.buildingDTO.locationList.forEach(location => {
          if (data.locationId === location.id) {
            data.locationName = location.locationName;
          }
        });
      });
      this.buildingDTO.totalRecords = this.buildingDTO.rows.length;
      this.buildingDTO.buildingList.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.notify.showSuccess(result.body.message);
      this.buildingService.loading = false;
    },
      (error) => {
        this.buildingDTO.buildingList = null;
        this.buildingDTO.totalRecords = 0;
        this.notify.showError(error.message);
        this.buildingService.loading = false;
      });
  }
  deleteConfirmation(buildingData: any) {
    this.buildingDTO.idToDelete = buildingData.id;
    this.buildingDTO.skId = buildingData.locationId;

    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.buildingService.delete(this.buildingDTO.idToDelete, this.buildingDTO.skId).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.onResetClick();
        }, (error) => {
          this.notify.showError(error.message);
        });
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });
  }

  getLocation() {
    this.buildingService.loading = true;
    this.locationService.getActiveLocationData().subscribe(location => {
      this.buildingDTO.locationList = location.data;


      this.buildingService.loading = false;
    });
  }

}
