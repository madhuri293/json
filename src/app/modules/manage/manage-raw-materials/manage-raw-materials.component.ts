import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ManageRawMaterials, ManageRawMaterialsDTO } from './manage-raw-materials.model';
import { ManageRawMaterialsService } from './manage-raw-materials.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';


@Component({
  selector: 'app-manage-raw-materials',
  templateUrl: './manage-raw-materials.component.html'
})
export class ManageRawMaterialsComponent implements OnInit {

  manageRawMaterials: ManageRawMaterials = new ManageRawMaterials();
  manageRawMaterialsDTO: ManageRawMaterialsDTO = new ManageRawMaterialsDTO();

  constructor(private formBuilder: FormBuilder,
    public manageRawMaterialsService: ManageRawMaterialsService,
    private notify: NotificationService,
    private commonService: CommonService,
    private bsModalService: BsModalService,
    private route: ActivatedRoute, private dashboardService: DashboadrdService) {
    this.manageRawMaterialsDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.getRawMaterialState();
    this.manageRawMaterialsFromControls();
    this.getManageRawMaterialsList();
    this.manageRawMaterialsDTO.rawMaterial = true;
    this.manageRawMaterialsDTO.nOfRecordPage = 10;

    this.manageRawMaterialsDTO.columns = [
      { field: 'materialName', header: 'Name' },
      { field: 'state', header: 'State' },
      { field: 'designation', header: 'Designation' },
      { field: 'status', header: 'Status' },
      { field: 'materialType', header: 'Raw Material Type' },

    ];
    if (this.manageRawMaterialsDTO.privilege) {
      this.manageRawMaterialsDTO.columns.push({ field: 'delete', header: 'Action' });
    }


    this.getStatus();
  }
  getStatus() {
    this.manageRawMaterialsDTO.statusList = this.commonService.getStatusList();
  }
  manageRawMaterialsFromControls() {
    this.manageRawMaterialsDTO.manageRawMaterialsForm = this.formBuilder.group(
      {
        rawMaterialName: new FormControl('', Validators.compose([Validators.required,
        Validators.pattern(SPACE_REGEXP), Validators.maxLength(128)])),
        designation: new FormControl('', Validators.compose([Validators.required, Validators.pattern(SPACE_REGEXP)])),
        rawMaterialState: new FormControl('', Validators.compose([Validators.required])),
        status: new FormControl('', Validators.compose([Validators.required])),
        indicator: new FormControl(false, Validators.compose([]))

      }
    );
  }
  onResetClick() {
    this.getManageRawMaterialsList();
    this.manageRawMaterials = new ManageRawMaterials();
    this.manageRawMaterialsDTO.manageRawMaterialsForm.reset();
    this.manageRawMaterialsDTO.manageRawMaterialsForm.patchValue({
      indicator: false
    });
    this.commonService.sendToggleFlag(true);

  }
  getManageRawMaterialsList() {
    this.manageRawMaterialsDTO.loading = true;
    this.manageRawMaterialsService.getAllRawMaterials().subscribe(result => {
      this.manageRawMaterialsDTO.loading = false;
      this.manageRawMaterialsDTO.manageRawMaterialsList = result.data;
      this.manageRawMaterialsDTO.rows = this.manageRawMaterialsDTO.manageRawMaterialsList;
      this.manageRawMaterialsDTO.manageRawMaterialsList.forEach(rawMaterial => {
        rawMaterial.status = this.commonService.getStatus(rawMaterial);
      });
      this.manageRawMaterialsDTO.totalRecords = this.manageRawMaterialsDTO.manageRawMaterialsList.length;
      this.manageRawMaterialsDTO.loading = false;
    },
      (error) => {
        this.manageRawMaterialsDTO.loading = false;
        this.notify.showError(error.message);
      });
  }
  getRawMaterialState() {
    this.manageRawMaterialsService.getAllRawMaterialState().subscribe(result => {
      this.manageRawMaterialsDTO.rawMaterialStateList = result.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  edit(evt: any) {
    this.manageRawMaterialsDTO.isDisabled = false;
    this.manageRawMaterials = new ManageRawMaterials();
    this.manageRawMaterialsService.getById(evt.id).subscribe(res => {
      this.manageRawMaterials = res.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  saveManageRawMaterials(manageRawMaterials: any) {
    this.manageRawMaterialsDTO.isDisabled = true;
    if (manageRawMaterials.isRawMaterial) {
      manageRawMaterials.isRawMaterial = 1;
    } else {
      manageRawMaterials.isRawMaterial = 0;
    }
    if (manageRawMaterials.id) {
      this.manageRawMaterialsService.update(manageRawMaterials).subscribe(result => {
        this.manageRawMaterialsDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();
      },
        (error) => {
          this.manageRawMaterialsDTO.isDisabled = false;
          this.notify.showError(error.message);
        });
    } else {
      this.manageRawMaterialsService.save(manageRawMaterials).subscribe(result => {
        this.manageRawMaterialsDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();
      }, (error) => {
        this.manageRawMaterialsDTO.isDisabled = false;
        this.notify.showError(error.message);
      });
    }

  }
  find(manageRawMaterials: ManageRawMaterials) {
    this.manageRawMaterials = manageRawMaterials;
    if (this.manageRawMaterialsDTO.manageRawMaterialsForm.valid || this.manageRawMaterialsDTO.manageRawMaterialsForm.dirty) {
      this.manageRawMaterialsDTO.loading = true;
      this.manageRawMaterialsService.find(this.manageRawMaterials).subscribe(result => {
        this.manageRawMaterialsDTO.manageRawMaterialsList = result.body.data;
        this.commonService.sendToggleFlag(true);

        this.manageRawMaterialsDTO.manageRawMaterialsList.forEach(element => {
          element.status = this.commonService.getStatus(element);
        });
        this.manageRawMaterialsDTO.rows = this.manageRawMaterialsDTO.manageRawMaterialsList;
        this.manageRawMaterialsDTO.totalRecords = this.manageRawMaterialsDTO.manageRawMaterialsList.length;
        this.notify.showSuccess(result.body.message);
        this.manageRawMaterialsDTO.loading = false;
      },
        (error) => {
          this.manageRawMaterialsDTO.loading = false;
          this.manageRawMaterialsDTO.manageRawMaterialsList = null;
          this.manageRawMaterialsDTO.totalRecords = 0;
          this.notify.showError(error.message);
        });
    } else {
      this.notify.showError('Enter at least one field to search');
    }
  }
  deleteConfirmation(manageUnit: any) {
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((flag: boolean) => {
      if (flag) {
        const techId = manageUnit.id;
        const sk = manageUnit.sk;
        this.manageRawMaterialsService.delete(techId, sk).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.onResetClick();
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
    });
  }


}
