import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SPACE_REGEXP, upperRangeAndLowerRange } from '../../../core/validators.ts/validators';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { Phd, PhdDTO, PhdPlantFlyoutDTO } from './phd.model';
import { TechnologyService } from '../technology/technology.service';
import { StatusEnum, DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { PlantService } from '../plant/plant.service';
import { CommonService } from '../../../shared/common-services/common.service';
import { PhdService } from './phd.service';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { Plant } from '../plant/plant.model';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
@Component({
  selector: 'app-phd',
  templateUrl: './phd.component.html'
})
export class PhdComponent implements OnInit {
  phd: Phd = new Phd();
  plant: Plant = new Plant();
  phdDTO: PhdDTO = new PhdDTO();
  phdPlantFlyoutDTO: PhdPlantFlyoutDTO = new PhdPlantFlyoutDTO();


  constructor(private formBuilder: FormBuilder,
    public phdService: PhdService,
    private notify: NotificationService,
    private router: ActivatedRoute,
    private technologyService: TechnologyService, private plantService: PlantService,
    private commonService: CommonService, private bsModalService: BsModalService, private dashboardService: DashboadrdService) {
    this.phdDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.phdDTO.nOfRecordPage = 10;
    this.dashboardService.showTechnologyHeader = true;
    this.phdService.loading = true;
    this.refresh();
    this.getPhdType();
    this.getPlantList();
    this.getTechnologies();
    this.getPhdList();
    this.PHDformControls();
    this.plantFlyOutFormControls();
    this.phdDTO.phdTag = true;
    this.phdDTO.columns = [
      { field: 'plantCode', header: 'Plant Code' },
      { field: 'logReadingLabel', header: 'Log Reading Label' },
      { field: 'phdTagName', header: 'PHD Tag Name' },
      { field: 'displayOrder', header: 'Display Order' },
      { field: 'phdTypeId', header: 'PHD Value Type' }

    ];
    if (this.phdDTO.privilege) {
      this.phdDTO.columns.push({ field: 'action', header: 'Action' });
    }
    this.phdPlantFlyoutDTO.cols = [
      { field: 'code', header: 'Plant Code' },
      { field: 'locationName', header: 'Location' },
      { field: 'buildingNumber', header: 'Building Number' }
    ];


  }
  onFlyoutLoad() {
    this.phdPlantFlyoutDTO.plantFlyOutForm.reset();
  }
  plantFlyOutFormControls() {
    this.phdPlantFlyoutDTO.plantFlyOutForm = this.formBuilder.group(
      {
        code: new FormControl(''),
        location: new FormControl(''),
        building: new FormControl(''),
      }
    );
  }
  PHDformControls() {
    this.phdDTO.PHDform = this.formBuilder.group(
      {
        technology: new FormControl('', Validators.compose([])),
        plantCode: new FormControl('', Validators.compose([Validators.required])),
        readingLabel: new FormControl('', Validators.compose([Validators.required,
        Validators.maxLength(255), Validators.pattern(SPACE_REGEXP)])),
        tagName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(128),
        Validators.pattern(SPACE_REGEXP)])),
        displayOrder: ['', Validators.compose([Validators.min(1), Validators.max(10000), Validators.required])],
        valueType: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP)])),
        minRange: new FormControl(''),
        maxRange: new FormControl(''),

      },
      {
        validators: [upperRangeAndLowerRange('maxRange', 'minRange')]
      }
    );

  }
  getTechnologies() {
    const techId = localStorage.getItem('technology');
    this.phd.technologyId = techId;
    this.technologyService.getAll().subscribe(result => {
      this.phdDTO.technology = result.data;
      this.phdDTO.technology = this.phdDTO.technology.filter(technology => technology.status === StatusEnum.Y && technology.id === techId);
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  getPlantList() {
    this.phdService.loading = true;
    this.plantService.getActivePlants().subscribe(result => {
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.phdPlantFlyoutDTO.rows = result.data;
      this.phdPlantFlyoutDTO.plantList = this.phdPlantFlyoutDTO.rows;
      this.phdPlantFlyoutDTO.nOfFlyRecordPage = 10;
      this.phdPlantFlyoutDTO.flyTotalRecords = this.phdPlantFlyoutDTO.rows.length;
      this.phdService.loading = false;
    },
      (error) => {
        this.phdService.loading = false;
      });
  }

  getPhdList() {
    this.phdService.loading = true;
    this.phdService.getAll().subscribe(result => {
      this.phdDTO.phdList = result.data;
      this.phdDTO.totalRecords = this.phdDTO.phdList.length;
      this.phdDTO.phdList.forEach(phd => {
        this.phdDTO.phdTypeList.forEach(phdType => {
          if (phdType.id === phd.phdTypeId) {
            phd.phdTypeId = phdType.typeName;
          }
        });
      });
      this.phdService.loading = false;
    }, (error) => {
      this.phdService.loading = false;
    });
  }

  getPhdType() {
    this.phdService.getPhdType().subscribe(result => {
      this.phdDTO.phdTypeList = result.data;
    }, (error) => {
    });
  }
  onResetClick() {
    this.phd = new Phd();
    this.plant = new Plant();
    this.phdDTO.PHDform.reset();
    this.phdPlantFlyoutDTO.plantFlyOutForm.reset();
    this.getPhdList();
    this.getTechnologies();

    this.commonService.sendToggleFlag(true);

  }
  onReset() {
    this.plant = new Plant();
    this.phd.plantId = '';
    this.phdPlantFlyoutDTO.plantFlyOutForm.reset();
    this.getPlantList();
    this.commonService.sendToggleFlag(true);

  }
  onFind(plant) {
    this.phdService.loading = true;
    plant.status = 'Y';
    plant.buildingNumber = plant.buildingName;
    this.plantService.findActivePalnts(plant).subscribe(result => {
      this.phdPlantFlyoutDTO.plantList = result.body.data;
      this.commonService.sendToggleFlag(true);
      this.phdService.loading = false;
      this.notify.showSuccess(result.body.message);
      this.phdPlantFlyoutDTO.flyTotalRecords = this.phdPlantFlyoutDTO.plantList.length;
    }, (error) => {
      this.phdService.loading = false;
      this.notify.showSuccess(error.message);
      this.phdPlantFlyoutDTO.flyTotalRecords = 0;
    });
  }

  save(phd: any) {
    this.phdDTO.isDisabled = true;
    phd.plantId = this.plant.id;
    if (phd.id) {
      this.phdService.update(phd).subscribe(result => {
        this.onResetClick();
        this.phdDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
      },
        (error) => {
          phd.plantId = this.phdDTO.plantName;
          this.phdDTO.isDisabled = false;
          this.notify.showError(error.message);
        });
    } else {
      this.phdService.save(phd).subscribe(result => {
        this.onResetClick();
        this.phdDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
      }, error => {
        phd.plantId = this.phdDTO.plantName;
        this.phdDTO.isDisabled = false;
        this.notify.showError(error.message);
      });
    }
  }
  deleteConfirmation(phd: any) {
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((flag: boolean) => {
      if (flag) {
        this.phdDTO.phdId = phd.id;
        const sk = phd.sk;
        this.phdService.delete(this.phdDTO.phdId, sk).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.onResetClick();
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
    });

  }
  find(phd: any) {
    this.phdDTO.totalRecords = 0;
    if (phd.plantId) {
      phd.plantId =  this.plant.id;
    }
    this.phdService.loading = true;
    this.phdService.find(phd).subscribe(result => {
      if (phd.plantId) {
        this.phd.plantId = this.phdDTO.plantName;
      }
      if (result) {
        this.notify.showSuccess(result.body.message);
        this.phdDTO.phdList = result.body.data;
        this.phdDTO.phdList.forEach(phdObject => {
          this.phdDTO.phdTypeList.forEach(phdType => {
            if (phdType.id === phdObject.phdTypeId) {
              phdObject.phdTypeId = phdType.typeName;
            }
          });
        });
        this.commonService.sendToggleFlag(true);
        this.phdDTO.totalRecords = this.phdDTO.phdList.length;
        this.phdService.loading = false;
      } else {
        if (phd.plantId) {
          this.phd.plantId = this.phdDTO.plantName;
          phd.plantId = this.phdDTO.plantName;
        }
        this.notify.showError(result.body.message);
      }
      this.phdService.loading = false;
    }, (error) => {
      this.phdDTO.phdList = null;
      this.phdDTO.totalRecords = 0;
      this.notify.showError(error.message);
      this.phdService.loading = false;
    });
  }

  onPlantSelect(plant: any) {
    this.phd.plantId = plant.code;
    this.phdDTO.plantName = plant.code;
    this.phdDTO.plantId = plant.id;
    this.plant.id = plant.id;
    this.plant.code = plant.code;
    const flyoutModelClose = document.getElementById('PHDPlantFlyOut');
    flyoutModelClose.click();
  }
  onPhdEdit(data: any) {
    this.phdDTO.isDisabled = false;
    this.plant = new Plant();
    this.phdService.getById(data.id).subscribe(result => {
      this.phd = result.data;
      const plantData = this.phdPlantFlyoutDTO.rows.filter(res => res.id === this.phd.plantId);
      this.phd.plantId = plantData[0].code;
      this.phdDTO.plantName = plantData[0].code;
      this.plant.id = plantData[0].id;
    }, error => {
      this.notify.showError(error.message);
      this.phdService.loading = false;
    });
  }

  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.phdDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.phdService.loading = true;
        this.getPlantList();
        this.getPhdList();
        this.getPhdType();
        this.getTechnologies();
        this.phdDTO.nOfRecordPage = 10;
        this.PHDformControls();
        this.plantFlyOutFormControls();
        this.phdDTO.phdTag = true;
        this.phdDTO.columns = [
          { field: 'plantCode', header: 'Plant Code' },
          { field: 'phdTagName', header: 'PHD Tag Name' },
          { field: 'logReadingLabel', header: 'Log Reading Label' },
          { field: 'displayOrder', header: 'Display Order' },
          { field: 'phdTypeId', header: 'PHD Value Type' }
        ];
        if (this.phdDTO.privilege) {
          this.phdDTO.columns.push({ field: 'action', header: 'Action' });
        }
        this.phdPlantFlyoutDTO.cols = [
          { field: 'code', header: 'Plant Code' },
          { field: 'locationName', header: 'Location' },
          { field: 'buildingNumber', header: 'Building Number' }
        ];
      }
    });
  }
}
