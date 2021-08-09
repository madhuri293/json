import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { ChemicalsUsedService } from './chemicals-used.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { ManageChemicals, ChemicalsDTO } from './chemicals-used.model';
import { CommonService } from '../../../shared/common-services/common.service';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-chemicals-used',
  templateUrl: './chemicals-used.component.html'
})
export class ChemicalsUsedComponent implements OnInit {
  manageChemicals: ManageChemicals = new ManageChemicals();
  chemicalsDTO: ChemicalsDTO = new ChemicalsDTO();


  constructor(private formBuilder: FormBuilder,
    public chemicalsUsedService: ChemicalsUsedService,
    private notify: NotificationService,
    private bsModalService: BsModalService,
    private router: ActivatedRoute,
    private commonService: CommonService, private dashboardService: DashboadrdService) {
    this.chemicalsDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;

    this.manageChemicalsFromControls();
    this.getmanageChemicalsList();
    this.getChemicalState();
    this.chemicalsTableColumns();
    this.chemicalsUsedService.loading = true;
    this.chemicalsDTO.nOfRecordPage = 10;
    this.getStatus();
  }
  getStatus() {
    this.chemicalsDTO.statusList = this.commonService.getStatusList();
  }
  chemicalsTableColumns() {
    this.chemicalsDTO.columns = [
      { field: 'chemicalName', header: 'Name' },
      { field: 'designation', header: 'Designation' },
      { field: 'state', header: 'State' },
      { field: 'supplier', header: 'Supplier Name' },
      { field: 'status', header: 'Status' },
    ];

    if (this.chemicalsDTO.privilege) {
      this.chemicalsDTO.columns.push({ field: 'action', header: 'Action' });
    }
  }

  manageChemicalsFromControls() {
    this.chemicalsDTO.manageChemicalsForm = this.formBuilder.group(
      {
       designation: new FormControl('', Validators.compose([Validators.required])),
        chemicalName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(128),
        Validators.pattern(SPACE_REGEXP)])),
        chemicalState: new FormControl('', Validators.compose([Validators.required])),
        supplierName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(128),
        Validators.pattern(SPACE_REGEXP)])),
        status: new FormControl('', Validators.compose([Validators.required])),

      }
    );
  }
  onResetClick() {
    this.getmanageChemicalsList();
    this.manageChemicals = new ManageChemicals();
    this.chemicalsDTO.manageChemicalsForm.reset();
    this.commonService.sendToggleFlag(true);


  }
  getmanageChemicalsList() {
    this.chemicalsUsedService.loading = true;
    this.chemicalsUsedService.getAllManageChemicals().subscribe(result => {
      this.chemicalsUsedService.loading = false;
      this.chemicalsDTO.manageChemicalsList = result.data;
      this.chemicalsDTO.manageChemicalsList.forEach(chemical => {
        chemical.status = this.commonService.getStatus(chemical);
      });
      this.chemicalsDTO.totalRecords = this.chemicalsDTO.manageChemicalsList.length;
      this.chemicalsDTO.numberOfRecords = 10;
    },
      (error) => {
        this.chemicalsUsedService.loading = false;
        this.chemicalsDTO.totalRecords = 0;
        this.notify.showError(error.message);
      });
  }
  getChemicalState() {
    this.chemicalsUsedService.getAllChemicalState().subscribe(result => {
      this.chemicalsDTO.chemicalStateList = result.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  edit(evt: any) {
    this.chemicalsDTO.loading = true;
    this.chemicalsDTO.isDisabled = false;
    this.chemicalsUsedService.getById(evt.id).subscribe(chemical => {
      this.manageChemicals = chemical.data;
      this.chemicalsDTO.loading = false;
    },
      (error) => {
        this.chemicalsDTO.loading = false;
        this.notify.showError(error.message);
      });
  }
  saveManageChemicals(manageChemicals: any) {
    this.chemicalsDTO.isDisabled = true;
    this.chemicalsDTO.loading = true;
    if (manageChemicals.id) {
      this.chemicalsUsedService.update(manageChemicals).subscribe(result => {
        this.chemicalsDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();
      },
        (error) => {
          this.chemicalsDTO.isDisabled = false;
          this.notify.showError(error.message);
          this.chemicalsDTO.loading = false;
        });
    } else {
      this.chemicalsUsedService.save(manageChemicals).subscribe(result => {
        this.chemicalsDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();
        this.chemicalsDTO.loading = false;
      }, (error) => {
        this.chemicalsDTO.isDisabled = false;
        this.chemicalsDTO.loading = false;
        this.notify.showError(error.message);
      });
    }

  }
  find(manageChemicals: any) {
    this.chemicalsUsedService.loading = true;
    this.chemicalsDTO.totalRecords = 0;
    if (this.chemicalsDTO.manageChemicalsForm.valid || this.chemicalsDTO.manageChemicalsForm.dirty) {
      this.chemicalsUsedService.find(manageChemicals).subscribe(result => {
        this.chemicalsDTO.manageChemicalsList = result.body.data;
        this.commonService.sendToggleFlag(true);

        this.chemicalsDTO.manageChemicalsList.forEach(chemicals => {
          chemicals.status = this.commonService.getStatus(chemicals);
        });
        this.chemicalsDTO.totalRecords = this.chemicalsDTO.manageChemicalsList.length;
        this.chemicalsUsedService.loading = false;
        this.notify.showSuccess(result.body.message);
      },
        (error) => {
          this.chemicalsUsedService.loading = false;
          this.chemicalsDTO.totalRecords = 0;
          this.notify.showError(error.message);
        });
    } else {
      this.chemicalsDTO.manageChemicalsForm.reset();
      this.notify.showError('Enter at least one field to search');
    }
  }
  deleteConfirmation(chemical: any) {
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((flag: boolean) => {
      if (flag) {
        this.chemicalsDTO.loading = true;
        const techId = chemical.id;
        const skId = chemical.sk;
        this.chemicalsUsedService.delete(techId, skId).subscribe(res => {
          this.notify.showSuccess(res.body.message);
          this.onResetClick();
        }, (error) => {
          this.notify.showError(error.message);
        });
      }
    });

  }
}
