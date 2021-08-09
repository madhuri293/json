import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Equipment, EquipmentDTO } from './equipment.model';
import { PlantService } from '../plant/plant.service';
import { EquipmentService } from './equipment.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html'
})
export class EquipmentComponent implements OnInit {

  equipment = new Equipment();
  equipmentDTO: EquipmentDTO = new EquipmentDTO();
  constructor(private formBuilder: FormBuilder, private router: Router, private bsModalService: BsModalService,
    private plantService: PlantService, public equipmentService: EquipmentService,
    private notify: NotificationService, private commonService: CommonService,
    private route: ActivatedRoute, private dashboardService: DashboadrdService) {
    this.equipmentDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;
    this.equipmentService.loading = true;
    this.equipmentDTO.isEnable = false;
    this.equipmentDTO.nOfRecordPage = 10;
    this.equipmentFormControls();
    this.getPlantList();
    this.getEquipmentdata();
    this.getVcfdata();
    this.getEquipmentGridDetails();
    this.getTechnologies();

    this.equipmentDTO.cols = [{ field: 'plantCode', header: 'Plant Code' },
    { field: 'equipmentName', header: 'Equipment Name' },
    { field: 'vesselTypeName', header: 'Equipment Type' },
    { field: 'calculationModulCode', header: 'Calculation Module' },
    { field: 'vcfTypeName', header: 'VCF Type' },
    { field: 'status', header: 'Status' },
    { field: 'calibrationButton', header: 'Calibration' }
    ];
    if (this.equipmentDTO.privilege) {
      this.equipmentDTO.cols.push({ field: 'Delete', header: 'Action' });
    }
    this.getStatus();
    this.refresh();
  }
  getStatus() {
    this.equipmentDTO.statusList = this.commonService.getStatusList();
  }
  getEquipmentGridDetails() {
    this.equipmentService.loading = true;
    this.equipmentService.getEquipmentGridDetails().subscribe(result => {
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      result.data.forEach(data => {
        this.equipmentDTO.plantCodedrop.forEach(plant => {
          if (plant.id === data.plantCode) {
            data.plantCode = plant.code;
          }
        });
      });

      this.equipmentDTO.equipmenttableData = result.data;
      this.equipmentDTO.totalRecords = result.data.length;

      this.equipmentService.loading = false;
    },
      (error) => {
        this.equipmentService.loading = false;
      });
  }



  getEquipmentdata() {
    this.equipmentService.getEquipmentDetails().subscribe(equipmentType => {
      this.equipmentDTO.equipmentType = equipmentType.data;
    });
  }

  changeEquipment(equipmentId: any) {
    this.equipmentService.getGetCalculationByEquipmentType(equipmentId).subscribe(calculationType => {
      this.equipmentDTO.equipmentcalculation = calculationType.data;
      this.equipment.calculationModuleId = null;

    });
  }


  getVcfdata() {
    this.equipmentService.getVcfDetails().subscribe(vcfType => {
      this.equipmentDTO.equipmentVcf = vcfType.data;
    });
  }
  getPlantList() {
    this.plantService.getActivePlants().subscribe(result => {

      this.equipmentDTO.plantCodedrop = result.data;
    },
      (error) => {
        this.notify.showError(error.error.Message);
      });
  }
  equipmentFormControls() {

    this.equipmentDTO.equipmentForm = this.formBuilder.group({

      plantCode: new FormControl('', Validators.compose([Validators.required])),
      equipmentName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100),
      Validators.pattern(SPACE_REGEXP)])),
      equipmentType: new FormControl('', Validators.compose([Validators.required])),
      calculationModule: new FormControl('', Validators.compose([Validators.required])),
      vcfType: new FormControl('', Validators.compose([Validators.required])),
      equipmentStatus: new FormControl('', Validators.compose([Validators.required])),
      technology:new FormControl(''),
    });

  }
  onReset() {
    this.equipmentDTO.isEnable = false;
    this.equipmentDTO.equipmentForm.reset();
    this.getTechnologies();


  }
  getTechnologies() {

    const selectedTechnology = localStorage.getItem('technology');
    this.equipment.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.equipmentDTO.technology = result.data;
      this.equipmentDTO.technology = this.equipmentDTO.technology.filter(val => val.status === StatusEnum.Y);
      this.equipmentDTO.technology = this.equipmentDTO.technology.filter(tech => tech.technologyId === selectedTechnology);

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  onRoleEditClick(evt: any) {
    this.equipmentDTO.isEnable = true;
    this.equipmentDTO.isDisabled = false;
    this.equipmentService.getById(evt.id).subscribe(role => {
      this.equipment = role.data;

      this.equipmentService.getCalculationDetails().subscribe(result => {
        result.data.forEach(data => {
          if (data.id === this.equipment.calculationModuleId) {
            this.equipmentDTO.equipmentcalculation = [data];
          }
        });
      });

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }



  saveEquipmentData(equipment: any) {
    this.equipmentDTO.isEnable = false;
    this.equipmentDTO.isDisabled = true;
    if (equipment.id) {


      this.equipmentService.update(equipment).subscribe(result => {
        this.equipmentDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();
      },
        (error) => {
          this.equipmentDTO.isDisabled = false;
          this.notify.showError(error.message);
        });

    } else {

      this.equipmentService.save(equipment).subscribe(result => {
        this.equipmentDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();

      }, (error) => {
        this.equipmentDTO.isDisabled = false;
        this.notify.showError(error.message);
      });
    }
  }
  onResetClick() {
    this.equipmentDTO.equipmentcalculation = null;
    this.getEquipmentGridDetails();
    this.equipment = new Equipment();
    this.equipmentDTO.equipmentForm.reset();
    this.commonService.sendToggleFlag(true);
    this.getTechnologies();


  }
  find(equipment: any) {
    if (this.equipmentDTO.equipmentForm.dirty || this.equipmentDTO.equipmentForm.valid) {
      this.equipmentService.loading = true;
      this.equipmentService.findEquipment(equipment).subscribe(result => {
        this.equipmentDTO.rows = result.body.data;
        this.commonService.sendToggleFlag(true);

        this.equipmentDTO.rows.forEach(data => {
          data.status = this.commonService.getStatus(data);
        });

        this.equipmentDTO.totalRecords = this.equipmentDTO.rows.length;

        this.equipmentDTO.equipmenttableData = this.equipmentDTO.rows;
        this.notify.showSuccess(result.body.message);
        this.equipmentService.loading = false;
      },
        (error) => {
          this.equipmentDTO.equipmentList = null;
          this.equipmentDTO.totalRecords = 0;
          this.notify.showError(error.message);
          this.equipmentService.loading = false;
        });
    } else {
      this.equipmentDTO.equipmentList = null;
      this.notify.showError('Enter at least one field to search');
    }

  }
  deleteConfirmation(equipment: any) {
    this.equipmentDTO.idToDelete = equipment.id;
    this.equipmentDTO.skId = equipment.technologyId;

    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onEquipmentDelete(this.equipmentDTO.idToDelete, this.equipmentDTO.skId);

      }
    });

  }

  onEquipmentDelete(data: number, sk: any) {
    this.equipmentService.delete(data, sk).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.onResetClick();
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }



  navigateToCalibration(event: any) {
    this.router.navigate(['/manage/calibration', event.data.id], {
      queryParams: {
        id: event.data.id,
      }
    });
  }

  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.equipmentDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.equipmentService.loading = true;
        this.equipmentDTO.isEnable = false;
        this.equipmentDTO.nOfRecordPage = 10;
        this.equipmentFormControls();
        this.getPlantList();
        this.getEquipmentdata();
        this.getVcfdata();
        this.getEquipmentGridDetails();
        this.getTechnologies();

        this.equipmentDTO.cols = [{ field: 'plantCode', header: 'Plant Code' },
        { field: 'equipmentName', header: 'Equipment Name' },
        { field: 'vesselTypeName', header: 'Equipment Type' },
        { field: 'calculationModulCode', header: 'Calculation Module' },
        { field: 'vcfTypeName', header: 'VCF Type' },
        { field: 'status', header: 'Status' },
        { field: 'calibrationButton', header: 'Calibration' }
        ];
        if (this.equipmentDTO.privilege) {
          this.equipmentDTO.cols.push({ field: 'Delete', header: 'Action' });
        }
        this.getStatus();
      }
    });
  }
}
