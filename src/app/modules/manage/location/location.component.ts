import { Component, OnInit } from '@angular/core';
import { Location, LocationDTO } from './location.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LocationService } from './location.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { BehaviorSubject } from 'rxjs';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit {

  location: Location = new Location();

  locationDTO: LocationDTO = new LocationDTO();


  constructor(private formBuilder: FormBuilder, public locationService: LocationService, private notify: NotificationService,
    private commonService: CommonService, private bsModalService: BsModalService,
    private route: ActivatedRoute, private dashboardService: DashboadrdService
  ) {
    this.locationDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.locationDTO.isEnable = false;
    this.locationDTO.nOfRecordPage = 10;
    this.locationFromControls();
    this.getLocationList();
    this.locationDTO.columns = [

      { field: 'code', header: ' Location Code' },
      { field: 'locationName', header: 'Location Name' },
      { field: 'description', header: 'Location Description' },
      { field: 'timeZoneName', header: 'Time Zone' },
      { field: 'status', header: 'Status' },
    ];
    if (this.locationDTO.privilege) {
      this.locationDTO.columns.push({ field: 'Action', header: 'Action' });
    }
    this.locationDTO.statusList = this.commonService.getStatusList();
    this.locationDTO.timeZoneList = [{ id: '(UTC-06:00) Central Time USA', timeZoneName: '(UTC-06:00) Central Time USA' },
    { id: '(UTC+01:00) Kosovo', timeZoneName: '(UTC+05:00) Kosovo' },
    { id: '(UTC−10:00 ) New Zealand', timeZoneName: '(UTC−10:00 ) New Zealand' },
    { id: '(UTC-11) Pacific/Midway', timeZoneName: '(UTC-11) Pacific/Midway' },
    { id: '(UTC-10) Pacific/Honolulu', timeZoneName: '(UTC-10) Pacific/Honolulu' },
    { id: '(UTC+5:45) Asia/Kathmandu', timeZoneName: '(UTC+5:45) Asia/Kathmandu' },
    { id: '(UTC+6) Antarctica/Vostok', timeZoneName: '(UTC+6) Antarctica/Vostok' },
    { id: '(UTC+6:30) Asia/Yangon', timeZoneName: '(UTC+6:30) Asia/Yangon' },
    { id: '(UTC+7) Asia/Bangkok', timeZoneName: '(UTC+7) Asia/Bangkok' },
    { id: '(UTC+8) Antarctica/Casey', timeZoneName: '(UTC+8) Antarctica/Casey' },
    ];
this.refresh();

  }

  locationFromControls() {
    this.locationDTO.locationForm = this.formBuilder.group(
      {
        locationCode: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10),
        Validators.pattern(SPACE_REGEXP)])),
        locationName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100),
        Validators.pattern(SPACE_REGEXP)])),
        locationDescription: new FormControl('', Validators.compose([Validators.maxLength(200)])),
        status: new FormControl('', Validators.compose([Validators.required])),
        timeZone: new FormControl('', Validators.compose([Validators.required])),

      }
    );

  }



  saveLocationData(location: any) {
    this.locationDTO.isEnable = false;
    this.locationDTO.isDisabled = true;
    if (location.id) {
      this.locationService.update(location).subscribe(result => {
        this.locationDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();

      },
        (error) => {
          this.locationDTO.isDisabled = false;
          this.notify.showError(error.message);
        });

    } else {
      this.locationService.save(location).subscribe(result => {
        this.locationDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();
      }, (error) => {
        this.locationDTO.isDisabled = false;
        this.notify.showError(error.message);
      });
    }

  }
  getLocationList() {
    this.locationService.loading = true;
    this.locationService.getAllLocationData().subscribe(result => {
      if (result.data) {
        result.data.forEach(data => {
          data.status = this.commonService.getStatus(data);

        });
        this.locationDTO.rows = result.data;
        this.locationDTO.totalRecords = this.locationDTO.rows.length;
        this.locationDTO.numberOfRecords = this.locationDTO.rows.length;
      }


      this.locationService.loading = false;
    }, (error) => {
      this.locationService.loading = false;
    });
  }

  onResetClick() {
    this.locationDTO.isEnable = false;
    this.getLocationList();
    this.location = new Location();
    this.locationDTO.locationForm.reset();
    this.commonService.sendToggleFlag(true);

  }
  onRoleEditClick(data: any) {
    this.locationDTO.isEnable = true;
    this.locationDTO.isDisabled = false;
    this.locationService.getById(data.id).subscribe(location => {
      this.location = location.data;

    }, (error) => {
      this.notify.showError(error.message);
    });
  }
  onRoleDelete(Code: number, sk: any) {
    this.locationService.delete(Code, sk).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.onResetClick();

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  find(location: any) {
    this.locationDTO.locationForm.clearValidators();
    if (this.locationDTO.locationForm.dirty || this.locationDTO.locationForm.valid) {
      this.locationService.loading = true;
      this.locationService.findLocation(location).subscribe(result => {
        this.locationDTO.rows = result.body.data;
        this.commonService.sendToggleFlag(true);

        if (result.body.data) {
          this.locationDTO.rows.forEach(data => {
            data.status = this.commonService.getStatus(data);

          });
          this.notify.showSuccess(result.body.message);
          this.locationDTO.totalRecords = this.locationDTO.rows.length;
          this.locationDTO.locationList = this.locationDTO.rows;
        } else {
          this.notify.showError(result.body.message);
          this.locationDTO.locationList = null;
          this.locationDTO.totalRecords = 0;
        }
        this.locationService.loading = false;
      },
        (error) => {
          this.locationDTO.rows = [];
          this.locationDTO.locationList = null;
          this.locationDTO.totalRecords = 0;
          this.notify.showError(error.message);
          this.locationService.loading = false;
        });
    } else {
      this.notify.showError('Please Enter at least one field to search');
    }
  }
  deleteConfirmation(location: any) {
    this.locationDTO.idToDelete = location.id;
    this.locationDTO.skId = location.id;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onRoleDelete(this.locationDTO.idToDelete, this.locationDTO.skId);
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });

  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.locationDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = false;
        this.locationService.loading = true;
        this.locationDTO.isEnable = false;
        this.locationDTO.nOfRecordPage = 10;
        this.locationDTO.totalRecords = 10;
        this.locationFromControls();
        this.getLocationList();
        this.locationDTO.columns = [

          { field: 'code', header: ' Location Code' },
          { field: 'locationName', header: 'Location Name' },
          { field: 'description', header: 'Location Description' },
          { field: 'timeZoneName', header: 'Time Zone' },
          { field: 'status', header: 'Status' },
        ];
        if (this.locationDTO.privilege) {
          this.locationDTO.columns.push({ field: 'Action', header: 'Action' });
        }
        this.locationDTO.statusList = this.commonService.getStatusList();
        this.locationDTO.timeZoneList = [{ id: '(UTC-06:00) Central Time USA', timeZoneName: '(UTC-06:00) Central Time USA' },
        { id: '(UTC+01:00) Kosovo', timeZoneName: '(UTC+05:00) Kosovo' },
        { id: '(UTC−10:00 ) New Zealand', timeZoneName: '(UTC−10:00 ) New Zealand' },
        { id: '(UTC-11) Pacific/Midway', timeZoneName: '(UTC-11) Pacific/Midway' },
        { id: '(UTC-10) Pacific/Honolulu', timeZoneName: '(UTC-10) Pacific/Honolulu' },
        { id: '(UTC+5:45) Asia/Kathmandu', timeZoneName: '(UTC+5:45) Asia/Kathmandu' },
        { id: '(UTC+6) Antarctica/Vostok', timeZoneName: '(UTC+6) Antarctica/Vostok' },
        { id: '(UTC+6:30) Asia/Yangon', timeZoneName: '(UTC+6:30) Asia/Yangon' },
        { id: '(UTC+7) Asia/Bangkok', timeZoneName: '(UTC+7) Asia/Bangkok' },
        { id: '(UTC+8) Antarctica/Casey', timeZoneName: '(UTC+8) Antarctica/Casey' },
        ];

      }
    })
  }
}
