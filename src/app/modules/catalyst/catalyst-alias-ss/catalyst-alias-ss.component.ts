import { Component, OnInit } from '@angular/core';
import { CatalystAlias, CatalystAliasDTO } from './catalyst-alias-ss.model';
import { CatalystAliasService } from './catalyst-alias.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { CatalystSizeService } from '../catalyst-size/catalyst-size.service';
import { CatalystShapeService } from '../catalyst-shape/catalyst-shape.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { CommonService } from '../../../shared/common-services/common.service';
import { DeleteMessageEnum } from '../../../shared/enum/enum.model';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
@Component({
  selector: 'app-catalyst-alias-ss',
  templateUrl: './catalyst-alias-ss.component.html'
})
export class CatalystAliasSsComponent implements OnInit {
  catalystAlias: CatalystAlias = new CatalystAlias();
  catalystAliasDto: CatalystAliasDTO = new CatalystAliasDTO();
  constructor(private catalystAliasService: CatalystAliasService, private catalystsizeService: CatalystSizeService,
    private catalystShapeService: CatalystShapeService, private commonService: CommonService, private router: ActivatedRoute,
    private formBuilder: FormBuilder, private notify: NotificationService,
    private bsModalService: BsModalService, private dashboardService: DashboadrdService) {
    this.catalystAliasDto.privilege = this.commonService.applyPrivilege(router.snapshot.data.name);
  }
  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;
    this.catalystAliasDto.isEnable = false;
    this.catalystAliasDto.nOfRecordPage = 10;

    this.catalystAliasFromControls();
    this.getcatalystAliasList();
    this.getCatalystShapeList();
    this.getcatalystSizeList();
    this.catalystAliasDto.columns = [

      { field: 'aliasName', header: ' Alias SS' },
      { field: 'shapeName', header: 'Shape' },
      { field: 'sizeCode', header: 'Size' },
      { field: 'status', header: 'Status' }
    ];
    if (this.catalystAliasDto.privilege) {
      this.catalystAliasDto.columns.push({ field: 'delete', header: 'Action' });
    }
    this.getStatus();
  }
  getStatus() {
    this.catalystAliasDto.statusList = this.commonService.getStatusList();
  }
  getcatalystSizeList() {
    this.catalystsizeService.getAllActiveCatalystSize().subscribe(result => {
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.catalystAliasDto.catalystSizeList = result.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  getCatalystShapeList() {
    this.catalystShapeService.getAllActiveCatalystShape().subscribe(result => {
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.catalystAliasDto.catalystShapeList = result.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  catalystAliasFromControls() {
    this.catalystAliasDto.catalystAliasForm = this.formBuilder.group(
      {
        catalystAliasName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255),
        Validators.pattern(SPACE_REGEXP)])),
        catalystShapeId: new FormControl('', Validators.compose([Validators.required])),
        catalystSizeId: new FormControl('', Validators.compose([Validators.required])),
        status: new FormControl('', Validators.compose([Validators.required])),
      }
    );

  }



  saveCatalystAliasData(catalystAlias: any) {

    this.catalystAliasDto.isEnable = false;
    this.catalystAliasDto.isDisabled = true;
    if (catalystAlias.id) {
      catalystAlias.status = this.commonService.getStatusToFind(catalystAlias);
      this.catalystAliasService.update(catalystAlias).subscribe(result => {
        this.catalystAliasDto.totalRecords = 0;

        this.catalystAliasDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.getcatalystAliasList();
        this.catalystAlias = new CatalystAlias();
        this.catalystAliasDto.catalystAliasForm.reset();
      },
        (error) => {
          this.catalystAliasDto.isDisabled = false;
          this.notify.showError(error.message);
          catalystAlias.status = this.commonService.getStatus(catalystAlias);
        });
    } else {
      catalystAlias.status = this.commonService.getStatusToFind(catalystAlias);
      this.catalystAliasService.save(catalystAlias).subscribe(result => {
            this.catalystAliasDto.totalRecords = 0;

        this.catalystAliasDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.getcatalystAliasList();
        this.catalystAlias = new CatalystAlias();
        this.catalystAliasDto.catalystAliasForm.reset();
      }, (error) => {
        this.catalystAliasDto.isDisabled = false;
        this.notify.showError(error.message);
        catalystAlias.status = this.commonService.getStatus(catalystAlias);
      });
    }

  }
  getcatalystAliasList() {
    this.catalystAliasDto.loading = true;

    this.catalystAliasService.getAllCatalystAlias().subscribe(result => {
      this.catalystAliasDto.loading = false;

      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.catalystAliasDto.rows = result.data;
      this.catalystAliasDto.totalRecords = this.catalystAliasDto.rows.length;
      this.catalystAliasDto.numberOfRecords = this.catalystAliasDto.rows.length;
    },
      (error) => {
        this.catalystAliasDto.loading = false;
        this.notify.showError(error.message);
      });
  }

  onResetClick() {
    this.catalystAliasDto.isEnable = false;
    this.catalystAliasDto.totalRecords = 0;

    this.getcatalystAliasList();
    this.catalystAlias = new CatalystAlias();
    this.catalystAliasDto.catalystAliasForm.reset();
    this.getcatalystSizeList();
    this.getCatalystShapeList();
    this.commonService.sendToggleFlag(true);

  }
  onRoleEditClick(evt: any) {
    this.catalystAliasDto.isEnable = true;
    this.catalystAliasDto.isDisabled = false;
    this.catalystAliasService.getById(evt.id).subscribe(role => {
      this.catalystAlias = role.data;
      role.data.status = this.commonService.getStatus(role.data);


    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
  onCatalystAliasDelete(data: number) {
    this.catalystAliasDto.skId = data;
    this.catalystAliasService.delete(data, this.catalystAliasDto.skId).subscribe(result => {
      this.catalystAlias = new CatalystAlias();
      this.notify.showSuccess(result.body.message);
      this.catalystAliasDto.catalystAliasForm.reset();
      this.getcatalystAliasList();
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  find(catalystAlias: any) {
    this.catalystAliasDto.catalystAliasList = 0;
    this.catalystAliasDto.totalRecords = 0;
    if (catalystAlias.status) {
      catalystAlias.status = this.commonService.getStatusToFind(catalystAlias);
    }
    if (this.catalystAliasDto.catalystAliasForm.valid || this.catalystAliasDto.catalystAliasForm.dirty) {
      this.catalystAliasDto.rows = [];
      this.catalystAliasDto.loading = true;
      this.catalystAliasService.findRole(catalystAlias).subscribe(result => {
        this.catalystAliasDto.rows = result.body.data;
        this.commonService.sendToggleFlag(true);

        this.catalystAliasDto.rows.forEach(data => {
          data.status = this.commonService.getStatus(data);
        });
        if (catalystAlias.status) {
          catalystAlias.status = this.commonService.getStatus(catalystAlias);
        }
        this.catalystAlias = catalystAlias;
        if (result.body.data.length === 0) {
          this.catalystAliasDto.catalystAliasList = result.body.data.length;
        } else {
          this.catalystAliasDto.catalystAliasList = result.body.data;
        }
        this.catalystAliasDto.numberOfRecords = this.catalystAliasDto.rows.length;
        this.catalystAliasDto.totalRecords = this.catalystAliasDto.rows.length;
        this.notify.showSuccess(result.body.message);
        this.catalystAliasDto.loading = false;
      },
        (error) => {
          this.catalystAliasDto.loading = false;
          this.catalystAliasDto.catalystAliasList = 0;
          this.catalystAliasDto.totalRecords = 0;
          if (catalystAlias.status) {
            catalystAlias.status = this.commonService.getStatus(catalystAlias);
          }
          this.catalystAlias = catalystAlias;

          this.notify.showError(error.message);
        });
    } else {
      this.catalystAliasDto.catalystAliasForm.reset();
      this.notify.showError('Enter at least one field to search');
    }
  }
  deleteConfirmation(catalystAlias: any) {
    this.catalystAliasDto.idToDelete = catalystAlias.id;

    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onCatalystAliasDelete(this.catalystAliasDto.idToDelete);
      }
    });

  }
}
