import { Component, OnInit} from '@angular/core';
import { Plant, PlantDTO } from './plant.model';
import { BehaviorSubject } from 'rxjs';

import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PlantService } from './plant.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { LocationService } from '../location/location.service';
import { BuildingService } from '../building/building.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { TechnologyService } from '../technology/technology.service';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html'
})
export class PlantComponent implements OnInit {

  plant: Plant = new Plant();

  plantDTO: PlantDTO = new PlantDTO();
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    public plantService: PlantService, private commonService: CommonService,
    private notify: NotificationService, private locationService: LocationService, private buildService: BuildingService,
    private bsModalService: BsModalService, private technologyService: TechnologyService, private dashboardService: DashboadrdService) {
    this.plantDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;
    this.plantDTO.isEnable = false;
    this.plantDTO.nOfRecordPage = 10;
    this.getLocation();
    this.getTechnologies();
    this.plantFromControls();
    this.getPlantList();
    this.plantDTO.columns = [

      { field: 'code', header: ' Plant Code' },
      { field: 'locationName', header: 'Location Name' },
      { field: 'buildingNumber', header: 'Building Number' },
      { field: 'plantTypeStatus', header: 'Sulfiding/Reducing Plant' },
      { field: 'status', header: 'Status' }
    ];

    if (this.plantDTO.privilege) {
      this.plantDTO.columns.push({ field: 'Delete', header: 'Action' });
    }
    this.refresh();

    this.getStatus();
  }
  getStatus() {
    this.plantDTO.statusList = this.commonService.getStatusList();
  }
  getTechnologies() {

    const selectedTechnology = localStorage.getItem('technology');
    this.plant.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.plantDTO.technology = result.data;
      this.plantDTO.technology = this.plantDTO.technology.filter(val => val.status === StatusEnum.Y);
      this.plantDTO.technology = this.plantDTO.technology.filter(tech => tech.technologyId === selectedTechnology);

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  plantFromControls() {
    this.plantDTO.plantForm = this.formBuilder.group(
      {
        code: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(25),
        Validators.pattern(SPACE_REGEXP)])),
        technology: new FormControl('', Validators.compose([])),
        location: new FormControl('', Validators.compose([Validators.required])),
        buildingId: new FormControl('', Validators.compose([Validators.required])),
        status: new FormControl('', Validators.compose([Validators.required])),
        plantTypeStatus: new FormControl('', Validators.compose([Validators.required])),

      }
    );

  }


  saveplantData(plant: any) {
    this.plantDTO.isEnable = false;
    this.plantDTO.isDisable = true;
    if (plant.id) {
      this.plantService.update(plant).subscribe(result => {
        this.notify.showSuccess(result.body.message);
        this.plantDTO.isDisable = false;
        this.getPlantList();
        this.plant = new Plant();
        this.plantDTO.plantForm.reset();
        this.plantDTO.buildingNumberList = null;
        this.getTechnologies();
      },
        (error) => {
          this.plantDTO.isDisable = false;
          this.notify.showError(error.message);
        });

    } else {
      this.plantService.save(plant).subscribe(result => {
        this.notify.showSuccess(result.body.message);
        this.plantDTO.isDisable = false;
        this.getPlantList();
        this.plant = new Plant();
        this.plantDTO.plantForm.reset();
        this.plantDTO.buildingNumberList = null;
        this.getTechnologies();
      }, (error) => {
        this.plantDTO.isDisable = false;
        this.notify.showError(error.message);
      });
    }

  }
  getPlantList() {
    this.plantService.loading = true;

    this.plantService.getAllPlants().subscribe(result => {
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);


      });

      this.plantDTO.rows = result.data;
      this.plantDTO.totalRecords = this.plantDTO.rows.length;
      this.plantService.loading = false;
    },
      (error) => {
        this.plantService.loading = false;
      });
  }

  onResetClick() {
    this.plantDTO.isEnable = false;
    this.plantDTO.buildingNumberList = null;
    this.getPlantList();
    this.plant = new Plant();
    this.plantDTO.plantForm.reset();
    this.getTechnologies();
    this.commonService.sendToggleFlag(true);


  }
  onRoleEditClick(evt: any) {
    this.plantDTO.isEnable = true;
    this.plantDTO.isDisable = false;
    this.plant = new Plant();
    this.plantService.getById(evt.id).subscribe(role => {
      this.plant = role.data;
      this.buildService.getAllBuildingDataByLocation(this.plant.locationId).subscribe(result => {
            this.plantDTO.buildingNumberList = result.data;
      });
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  onPlantDelete(data: number, sk: any) {
    this.plantService.delete(data, sk).subscribe(result => {
      this.plant = new Plant();
      this.plantDTO.plantForm.reset();
      this.plantDTO.buildingNumberList = null;
      this.notify.showSuccess(result.body.message);
      this.getPlantList();
      this.onResetClick();
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  find(plant: any) {
    if (this.plantDTO.plantForm.valid || this.plantDTO.plantForm.dirty) {
      this.plantDTO.rows = [];

      this.plantService.loading = true;
      this.plantService.findRole(plant).subscribe(result => {
        this.plantDTO.rows = result.body.data;
        this.commonService.sendToggleFlag(true);

        this.plantDTO.rows.forEach(data => {
          data.status = this.commonService.getStatus(data);


        });
        this.plantDTO.plantList = result.body.data.length;
        this.plantDTO.totalRecords = this.plantDTO.rows.length;
        this.notify.showSuccess(result.body.message);
        this.plantService.loading = false;
      },
        (error) => {
          this.plantDTO.plantList = [];
          this.plantDTO.totalRecords = 0;
          this.notify.showError(error.message);
          this.plantService.loading = false;
        });
    } else {
      this.notify.showError('Enter at least one field to search');
    }

  }
  deleteConfirmation(plant: any) {
    this.plantDTO.idToDelete = plant.id;
    this.plantDTO.skId = plant.technologyId;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onPlantDelete(this.plantDTO.idToDelete, this.plantDTO.skId);
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });
  }


  getLocation() {
    this.locationService.getActiveLocationData().subscribe(location => {
      this.plantDTO.locationList = location.data;
    });
  }

  changeLocation(locationId: any) {
    this.buildService.getAllBuildingDataByLocation(locationId).subscribe(building => {
      this.plantDTO.buildingNumberList = building.data;
      this.plant.buildingId = null;
    });
  }

  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.plantDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
        this.plantService.loading = true;
        this.dashboardService.showTechnologyHeader = true;
        this.plantDTO.isEnable = false;
        this.plantDTO.nOfRecordPage = 10;
        this.getLocation();
        this.getTechnologies();
        this.plantFromControls();
        this.getPlantList();
        this.plantDTO.columns = [

          { field: 'code', header: ' Plant Code' },
          { field: 'locationName', header: 'Location Name' },
          { field: 'buildingNumber', header: 'Building Number' },
          { field: 'plantTypeStatus', header: 'Sulfiding/Reducing Plant' },
          { field: 'status', header: 'Status' }
        ];

        if (this.plantDTO.privilege) {
          this.plantDTO.columns.push({ field: 'Delete', header: 'Action' });
        }

        this.getStatus();
      }
    })
  }
}
