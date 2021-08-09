import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators } from '@angular/forms';
import { RunObjective, RunObjectiveDTO } from './run-objective.model';
import { RunObjectiveService } from './run-objective.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { TechnologyService } from '../technology/technology.service';

import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { CommonService } from '../../../shared/common-services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-run-objective',
  templateUrl: './run-objective.component.html'
})
export class RunObjectiveComponent implements OnInit {

  runObjective = new RunObjective();
  runObjectiveDto = new RunObjectiveDTO();
  constructor(private formBuilder: FormBuilder,
    private runObjectiveService: RunObjectiveService,
    private notify: NotificationService,
    private router: ActivatedRoute,
    private technologyService: TechnologyService, private dashboardService: DashboadrdService, private bsModalService: BsModalService,
    private commonService: CommonService) {
    this.runObjectiveDto.privilege = this.commonService.applyPrivilege(router.snapshot.data.name);
  }

  ngOnInit() {
    this.refresh();
    this.dashboardService.showTechnologyHeader = true;
    this.runObjectiveDto.loading = true;
    this.runObjectiveDto.nOfRecordPage = 10;
    // this.runObjectiveDto.totalRecords = 10;

    this.runObjectiveDto.columns = [
      { field: 'technologyName', header: 'Technology' },
      { field: 'processName', header: 'Process Name' },
      { field: 'objectiveName', header: 'Objective Name' },
    ];
    if (this.runObjectiveDto.privilege) {
      this.runObjectiveDto.columns.push({ field: '', header: 'Action' });
    }
    this.registerFromControls();
    this.getAllTechnology();
    this.getAllProcesss();
    this.getRunObjective();

  }

  registerFromControls() {
    this.runObjectiveDto.runObjectiveForm = this.formBuilder.group(
      {
        technology: new FormControl('', Validators.compose([])),
        processName: new FormControl('', Validators.compose([Validators.required])),
        objectiveName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
      }
    );
  }
  getAllProcesss() {
    this.runObjectiveService.getAllProcess().subscribe(result => {
      this.runObjectiveDto.processList = result.data;
    }, error => {
      this.notify.showError(error.message);
    });
  }
  getAllTechnology() {
    const selectedTechnology = localStorage.getItem('technology');
    this.runObjective.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.runObjectiveDto.technology = result.data;
      this.runObjectiveDto.technology = this.runObjectiveDto.technology.filter(tech => tech.technologyId === selectedTechnology);
      this.runObjectiveDto.technology = this.runObjectiveDto.technology.filter(val => val.status === StatusEnum.Y);
    }, error => {
      this.notify.showError(error.message);
    });
  }

  save(runObjective: RunObjective) {
    this.runObjectiveDto.isDisabled = true;
    if (runObjective.id) {
      this.runObjectiveService.update(runObjective).subscribe(result => {
        if (result.status === 200) {
          this.reset();
          this.getRunObjective();
          this.runObjectiveDto.isDisabled = false;
          this.notify.showSuccess(result.body.message);
        } else {
          this.notify.showError(result.body.message);
        }
      },
        (error) => {
          this.runObjectiveDto.isDisabled = false;
          this.notify.showError(error.message);
        });
    } else {
      this.runObjectiveService.save(runObjective).subscribe(result => {
        if (result.status === 200) {
          this.reset();
          this.getRunObjective();
          this.runObjectiveDto.isDisabled = false;
          this.notify.showSuccess(result.body.message);
        }
      }, error => {
        this.runObjectiveDto.isDisabled = false;
        this.notify.showError(error.message);
      });
    }
  }
  reset() {
    this.runObjective = new RunObjective();
    this.runObjectiveDto.runObjectiveForm.reset();
    this.getRunObjective();
    this.getAllTechnology();
    this.commonService.sendToggleFlag(true);


  }

  onEdit(data: any) {
    this.runObjectiveDto.isDisabled = false;
    this.runObjectiveService.getById(data.id).subscribe(result => {
      this.runObjective = result.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  compareFn(c1: any, c2: any) {
    return c1 && c2 && (c1.id === c2.id);
  }

  find(runObjective: RunObjective) {
    if (this.runObjectiveDto.runObjectiveForm.dirty || this.runObjectiveDto.runObjectiveForm.valid) {
      this.runObjectiveService.findRunObjective(runObjective).subscribe(result => {
        this.runObjectiveDto.rows = result.body.data;
        if (result.body.data) {
          this.notify.showSuccess(result.body.message);
          this.commonService.sendToggleFlag(true);

          this.runObjectiveDto.totalRecords = this.runObjectiveDto.rows.length;
          this.runObjectiveDto.runObjectiveRecords = this.runObjectiveDto.rows;
        } else {
          this.notify.showError(result.body.message);
          this.runObjectiveDto.totalRecords = this.runObjectiveDto.rows.length;
          this.runObjectiveDto.numberOfRecords = this.runObjectiveDto.rows.length;
          this.runObjectiveDto.runObjectiveRecords = this.runObjectiveDto.rows.slice(0, this.runObjectiveDto.nOfRecordPage);
        }
      },
        (error) => {
          this.runObjectiveDto.rows = [];
          this.runObjectiveDto.runObjectiveRecords = null;
          this.runObjectiveDto.totalRecords = 0;
          this.notify.showError(error.message);
        });
    } else {
      this.notify.showError('Please Enter at least one field to search');
    }
  }

  getRunObjective() {
    this.runObjectiveService.getAllRunObjective().subscribe(result => {
      this.runObjectiveDto.loading = false;

      this.runObjectiveDto.runObjectiveList = result.data;
      this.runObjectiveDto.runObjectiveRecords = this.runObjectiveDto.runObjectiveList;
      this.runObjectiveDto.totalRecords = this.runObjectiveDto.runObjectiveList.length;
    }, (error) => {
      this.notify.showError(error.message);
    }
    );
  }



  deleteConfirmation(runObjective: any) {
    this.runObjectiveDto.idToDelete = runObjective.id;
    this.runObjectiveDto.skToDelete = runObjective.technologyId;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onRunObjectiveDelete(this.runObjectiveDto.idToDelete, this.runObjectiveDto.skToDelete);
      }
    });
  }

  onRunObjectiveDelete(id: number, sk: any) {
    this.runObjectiveService.delete(id, sk).subscribe(result => {
      this.runObjective = new RunObjective();
      this.runObjectiveDto.runObjectiveForm.reset();

      this.notify.showSuccess(result.body.message);
      this.getRunObjective();
      this.getAllTechnology();
    },
      (error) => {

        this.notify.showError(error.message);
      });
  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.runObjectiveDto.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.runObjectiveDto.loading = true;
        this.runObjectiveDto.nOfRecordPage = 10;
        this.runObjectiveDto.totalRecords = 10;

        this.runObjectiveDto.columns = [
          { field: 'technologyName', header: 'Technology' },
          { field: 'processName', header: 'Process Name' },
          { field: 'objectiveName', header: 'Objective Name' },
        ];
        if (this.runObjectiveDto.privilege) {
          this.runObjectiveDto.columns.push({ field: '', header: 'Action' });
        }
        this.registerFromControls();
        this.getAllTechnology();
        this.getAllProcesss();
        this.getRunObjective();
      }
    })
  }
}
