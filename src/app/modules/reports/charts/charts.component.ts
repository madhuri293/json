import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RolesService } from '../../manage/roles/roles.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { BsModalService } from 'ngx-bootstrap';
import { CommonService } from '../../../shared/common-services/common.service';
import { BehaviorSubject } from 'rxjs';
import { ChartDTO, ReportsCharts } from './charts.model';
import { SPACE_REGEXP, linValidator } from '../../../core/validators.ts/validators';
import { ChartsService } from './charts.service';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html'
})
export class ChartsComponent implements OnInit, OnDestroy {
  chartDto: ChartDTO = new ChartDTO();
  reportsCharts: ReportsCharts = new ReportsCharts();
  constructor(private formBuilder: FormBuilder,
    private roleService: RolesService, private notify:
      NotificationService, private bsModalService: BsModalService, private router: ActivatedRoute,
    private commonService: CommonService, private dashboardService: DashboadrdService,
    private chartsService: ChartsService) {
    this.chartDto.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
  }
  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;
    this.chartDto.loading = true;

    this.buildForm();
    this.getTechnologies();
    this.getChartsByTechnology();
    this.chartDto.technologyId = localStorage.getItem('technology');
    const userDetails = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    this.chartDto.userId = userDetails.userId;
    this.chartDto.nOfRecordPage = 10;
    this.chartDto.columns = [
      { field: 'chartName', header: 'Chart Name' },
      { field: 'description', header: 'Chart Description' }
    ];
    if (this.chartDto.privilege) {
      this.chartDto.columns.push({ field: 'action', header: 'Action' });
    }
    this.refresh();
  }
  buildForm() {
    this.chartDto.chartForm = this.formBuilder.group(
      {
        name: new FormControl('', [Validators.required, Validators.maxLength(20),
        Validators.pattern(SPACE_REGEXP)
        ]),
        description: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        technology: new FormControl('')
      });
    this.chartDto.chartForm.setValidators(Validators.compose([Validators.required,
    Validators.maxLength(100), linValidator('description'), Validators.pattern(SPACE_REGEXP)]));
  }
  getChartsByTechnology() {
    this.chartsService.getAll().subscribe(result => {
      this.chartDto.loading = false;
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.chartDto.rows = result.data;
      this.chartDto.totalRecords = this.chartDto.rows.length;
    },
      (error) => {
        this.chartDto.loading = false;
        this.notify.showError(error.message);
      });
  }
  getTechnologies() {
    const selectedTechnology = localStorage.getItem('technology');
    this.reportsCharts.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.chartDto.technologyData = result.data;
      this.chartDto.technologyData = this.chartDto.technologyData.filter(tech => tech.technologyId === selectedTechnology);
      this.chartDto.technologyData = this.chartDto.technologyData.filter(val => val.status === StatusEnum.Y);
    }, error => {
      this.notify.showError(error.message);
    });
  }





  saveChart(chart: any) {
    this.chartDto.isDisabled = true;
    chart.userId = this.chartDto.userId;

    if (chart.id) {
      this.chartDto.loading = true;
      this.chartsService.update(chart).subscribe(result => {
        this.chartDto.loading = false;
        this.chartDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.resetCharts();

      },
        (error) => {
          this.chartDto.isDisabled = false;
          this.notify.showError(error.message);
          this.chartDto.loading = false;
        });

    } else {
      this.chartDto.loading = true;
      this.chartsService.save(chart).subscribe(result => {
        this.chartDto.loading = false;
        this.chartDto.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.resetCharts();
      }, (error) => {
        this.chartDto.isDisabled = false;
        this.notify.showError(error.message);
        this.chartDto.loading = false;
      });
    }
  }
  resetCharts() {
    this.chartDto.loading = true;
    this.chartDto.chartForm.reset();
    this.chartDto.rows = null;
    this.getChartsByTechnology();
    this.reportsCharts = new ReportsCharts();
    this.getTechnologies();
    this.commonService.sendToggleFlag(true);

  }
  onChartEditClick(data: any) {
    this.chartDto.isDisabled = false;
    this.chartsService.getById(data.id).subscribe(result => {
      this.reportsCharts = result.data;
    },
      (error) => {
        this.notify.showError(error.message);
      });

  }

  deleteConfirmation(chart: any) {
    this.chartDto.idToDelete = chart.id;
    this.chartDto.skId = this.chartDto.technologyId;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onChartDelete(this.chartDto.idToDelete, this.chartDto.skId);
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });
  }
  onChartDelete(data: number, sk: any) {
    this.chartDto.loading = true;
    this.chartsService.delete(data, sk).subscribe(result => {
      this.chartDto.loading = false;
      this.reportsCharts = new ReportsCharts();
      this.chartDto.chartForm.reset();
      this.notify.showSuccess(result.body.message);

      this.getChartsByTechnology();
      this.getTechnologies();
    },
      (error) => {
        this.notify.showError(error.message);

        this.getChartsByTechnology();
      });
  }

  findChart(chart: any) {
    this.chartDto.totalRecords = 0;
    if (this.chartDto.chartForm.valid || this.chartDto.chartForm.dirty) {
      this.chartDto.rows = [];

      this.chartDto.loading = true;
      this.chartsService.findChart(chart).subscribe(result => {
        this.chartDto.loading = false;
        this.commonService.sendToggleFlag(true);

        this.chartDto.rows = result.body.data;
        this.chartDto.rows.forEach(data => {
          data.status = this.commonService.getStatus(data);
        });
        this.chartDto.rows = result.body.data;
        this.chartDto.totalRecords = this.chartDto.rows.length;
        this.notify.showSuccess(result.body.message);
      },
        (error) => {
          this.chartDto.loading = false;
          this.chartDto.rows = [];
          this.chartDto.totalRecords = 0;
          this.notify.showError(error.message);
        });
    } else {
      this.notify.showError('Enter at least one field to search');
    }
  }



  ngOnDestroy() {
    this.commonService.configFlag = new BehaviorSubject(false);
  }

  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.chartDto.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.chartDto.loading = true;
        this.buildForm();
        this.getTechnologies();
        this.getChartsByTechnology();
        this.chartDto.technologyId = localStorage.getItem('technology');
        const userDetails = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
        this.chartDto.userId = userDetails.userId;
        this.chartDto.nOfRecordPage = 10;
        this.chartDto.columns = [
          { field: 'chartName', header: 'Chart Name' },
          { field: 'description', header: 'Chart Description' }
        ];
        if (this.chartDto.privilege) {
          this.chartDto.columns.push({ field: 'action', header: 'Action' });
        }
      }
    });
  }
}
