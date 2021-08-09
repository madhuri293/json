import { Component, OnInit } from '@angular/core';
import { PlotDTO, ReportsPlots } from './plots.model';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { SPACE_REGEXP, linValidator } from '../../../core/validators.ts/validators';
import { RolesService } from '../../manage/roles/roles.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { BsModalService } from 'ngx-bootstrap';
import { CommonService } from '../../../shared/common-services/common.service';
import { PlotsService } from './plots.service';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-plots',
  templateUrl: './plots.component.html'
})
export class PlotsComponent implements OnInit {
  plotDto: PlotDTO = new PlotDTO();
  reportsPlots: ReportsPlots = new ReportsPlots();
  constructor(private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private roleService: RolesService, private notify:
      NotificationService, private bsModalService: BsModalService,
    private commonService: CommonService, private plotsService: PlotsService, private dashboardService: DashboadrdService) {
    this.plotDto.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;
    this.plotDto.loading = true;

    this.buildForm();
    this.getTechnologies();
    this.getPlotsByTechnology();
    this.plotDto.technologyId = localStorage.getItem('technology');
    const userDetails = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    this.plotDto.userId = userDetails.userId;
    this.plotDto.nOfRecordPage = 10;
    this.plotDto.columns = [
      { field: 'plotName', header: 'Plot Name' },
      { field: 'description', header: 'Plot Description' },

    ];
    if (this.plotDto.privilege) {
      this.plotDto.columns.push({ field: 'action', header: 'Action' });
    }
    this.refresh();
  }
  buildForm() {
    this.plotDto.plotForm = this.formBuilder.group(
      {
        name: new FormControl('', [Validators.required, Validators.maxLength(20),
        Validators.pattern(SPACE_REGEXP)
        ]),
        description: new FormControl('', [Validators.maxLength(100), Validators.required]),
        technology: new FormControl('')

      });
    this.plotDto.plotForm.setValidators(Validators.compose([Validators.required,
    Validators.maxLength(100), linValidator('description'), Validators.pattern(SPACE_REGEXP)]));
  }
  getPlotsByTechnology() {
    this.plotsService.getAll().subscribe(result => {
      this.plotDto.loading = false;
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });

      this.plotDto.rows = result.data;
      this.plotDto.totalRecords = this.plotDto.rows.length;
    },
      (error) => {
        this.plotDto.loading = false;
        this.notify.showError(error.message);
      });
  }
  getTechnologies() {
    const selectedTechnology = localStorage.getItem('technology');
    this.reportsPlots.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.plotDto.technologyData = result.data;
      this.plotDto.technologyData = this.plotDto.technologyData.filter(tech => tech.technologyId === selectedTechnology);
      this.plotDto.technologyData = this.plotDto.technologyData.filter(val => val.status === StatusEnum.Y);
    }, error => {
      this.notify.showError(error.message);
    });
  }

  resetPlots() {
    this.plotDto.loading = true;
    this.reportsPlots = new ReportsPlots();
    this.plotDto.plotForm.reset();
    this.plotDto.rows = null;
    this.getPlotsByTechnology();
    this.getTechnologies();
    this.commonService.sendToggleFlag(true);

  }

  savePlot(plot: any) {
    this.plotDto.isDisabled = true;
    plot.userId = this.plotDto.userId;

    if (plot.id) {
      this.plotDto.loading = true;
      this.plotsService.update(plot).subscribe(result => {
        this.plotDto.loading = false;
        this.plotDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.resetPlots();
        this.getPlotsByTechnology();
        this.getTechnologies();

      },
        (error) => {
          this.plotDto.loading = false;
          this.plotDto.isDisabled = false;
          this.notify.showError(error.message);
        });

    } else {
      this.plotDto.loading = true;
      this.plotsService.save(plot).subscribe(result => {
        this.plotDto.loading = false;
        this.plotDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.resetPlots();
        this.getPlotsByTechnology();
        this.getTechnologies();
      }, (error) => {
        this.plotDto.loading = false;
        this.plotDto.isDisabled = false;
        this.notify.showError(error.message);
      });
    }
  }
  onPlotEditClick(data: any) {
    this.plotDto.isDisabled = false;
    this.plotsService.getById(data.id).subscribe(result => {
      this.reportsPlots = result.data;
    },
      (error) => {
        this.plotDto.loading = false;
        this.notify.showError(error.message);
      });

  }

  deleteConfirmation(plot: any) {
    this.plotDto.idToDelete = plot.id;
    this.plotDto.skId = this.plotDto.technologyId;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onPlotDelete(this.plotDto.idToDelete, this.plotDto.skId);
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });
  }
  onPlotDelete(data: number, sk: any) {
    this.plotDto.loading = true;
    this.plotsService.delete(data, sk).subscribe(result => {
      this.plotDto.loading = false;
      this.reportsPlots = new ReportsPlots();
      this.plotDto.plotForm.reset();
      this.notify.showSuccess(result.body.message);
      this.getPlotsByTechnology();
      this.getTechnologies();
    },
      (error) => {
        this.plotDto.loading = false;
        this.notify.showError(error.message);
      });
  }
  findPlot(plot: any) {
    this.plotDto.totalRecords = 0;
    if (this.plotDto.plotForm.valid || this.plotDto.plotForm.dirty) {
      this.plotDto.rows = [];

      this.plotDto.loading = true;
      this.plotsService.findPlot(plot).subscribe(result => {
        this.plotDto.loading = false;
        this.commonService.sendToggleFlag(true);

        this.plotDto.rows = result.body.data;
        this.plotDto.rows.forEach(data => {
          data.status = this.commonService.getStatus(data);
        });
        this.plotDto.rows = result.body.data;
        this.plotDto.totalRecords = this.plotDto.rows.length;
        this.notify.showSuccess(result.body.message);
      },
        (error) => {
          this.plotDto.loading = false;
          this.plotDto.rows = [];
          this.plotDto.totalRecords = 0;
          this.notify.showError(error.message);
        });
    } else {
      this.notify.showError('Enter at least one field to search');
    }
  }

  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.plotDto.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.plotDto.loading = true;
        this.buildForm();
        this.getTechnologies();
        this.getPlotsByTechnology();
        this.plotDto.technologyId = localStorage.getItem('technology');
        const userDetails = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
        this.plotDto.userId = userDetails.userId;
        this.plotDto.nOfRecordPage = 10;
        this.plotDto.columns = [
          { field: 'plotName', header: 'Plot Name' },
          { field: 'description', header: 'Plot Description' },

        ];
        if (this.plotDto.privilege) {
          this.plotDto.columns.push({ field: 'action', header: 'Action' });
        }
      }
    });
  }

}
