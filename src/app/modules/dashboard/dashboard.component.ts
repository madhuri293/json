import { Component, OnInit } from '@angular/core';
import { DashboadrdService } from './dashboadrd.service';
import { Report, Grpah, DashBoardDTO } from './dashboard.model';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../core/services/notification/notification-service.service';
import { linValidator, SPACE_REGEXP } from '../../core/validators.ts/validators';
import { ChartsService } from '../reports/charts/charts.service';
import { CommonService } from '../../shared/common-services/common.service';
import { PlotsService } from '../reports/plots/plots.service';
import { UomTemplateService } from '../manage/uom-template/uom-template.service';
import { StatusEnum } from '../../shared/enum/enum.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  report = new Report();
  graph = new Grpah();
  dashBoardDTO: DashBoardDTO = new DashBoardDTO();
  toggleFlag: boolean;
  toggleGraphFlag: boolean;
  constructor(public dashboardService: DashboadrdService,
    private formBuilder: FormBuilder,
    private plotsService: PlotsService,
    private notify: NotificationService, private chartsService: ChartsService, private commonService: CommonService,
    private uomService: UomTemplateService) {
    this.dashboardService.sendHideFlag(false);
  }

  ngOnInit() {
    this.getTechnologies();
    this.dashboardService.loading = true;
    setTimeout(() => {
      this.dashboardService.loading = false;
    }, 1500);
    const userDetails = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj'))
    );
    if (localStorage.getItem('technology') === null) {
      this.dashBoardDTO.isTechnology = 'block';
      this.dashboardService.showTechnologyHeader = false;
      this.dashboardService.technologyId = localStorage.getItem('technology');
    } else {
      this.dashBoardDTO.isTechnology = 'none';
      this.dashboardService.showTechnologyHeader = true;
      this.dashBoardDTO.user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj'))
      );
    }

    this.dashBoardDTO.user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj'))
    );
    this.dashBoardDTO.userId = userDetails.userId;
    this.getTechnologiesChartPlot();
    this.getAllDashbordCharts(this.dashBoardDTO.userId);
    this.getAllDashbordPlots(this.dashBoardDTO.userId);
    this.buildForm();
    this.dashBoardDTO.chartnOfRecordPage = 10;
    this.dashBoardDTO.plotnOfRecordPage = 10;
    this.dashBoardDTO.chartColumns = [
      { field: 'chartName', header: 'Chart Name' },
      { field: 'description', header: 'Chart Description' },
      { field: 'action', header: 'Select' }
    ];
    this.dashBoardDTO.plotColumns = [
      { field: 'plotName', header: 'Plot Name' },
      { field: 'description', header: 'Plot Description' },
      { field: 'action', header: 'Select' }
    ];


    this.chartFormControl();
    this.plotFormControl();
  }
  getAllDashbordCharts(userId: any) {
    this.dashboardService.getAllDashbordCharts(userId).subscribe(result => {
      this.dashBoardDTO.allChartFull = result.data;
      this.dashBoardDTO.allChart = result.data.slice(0, 9);
    });
  }
  getAllDashbordPlots(userId: any) {
    this.dashboardService.getAllDashbordPlots(userId).subscribe(result => {
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.dashBoardDTO.allPlotFull = result.data;
      this.dashBoardDTO.allPlot = result.data.slice(0, 9);

    });
  }
  onTechnologySelect(selectedTechnology: any) {
    // make a api call to get all charts----
    this.getChartsByTechnology(selectedTechnology);

  }
  onTechnologySelectPlots(selectedTechnology: any) {
    // make a api call to get all charts----
    this.getPlotsByTechnology(selectedTechnology);
  }
  getPlotsByTechnology(selectedTechnology: any) {
    this.dashboardService.loading = true;
    this.plotsService.getAllplotsbytechnology(selectedTechnology).subscribe(result => {
      this.dashboardService.loading = false;
      result.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.dashBoardDTO.tempAllPlotRows = result.data;
      this.getUserPlot(selectedTechnology);
    },
      (error) => {
        this.dashboardService.loading = false;
        this.notify.showError(error.message);
      });
  }
  getUserPlot(selectedTechnology: any) {
    this.dashboardService.loading = true;
    this.dashboardService.getUserPlot(selectedTechnology, this.dashBoardDTO.userId).subscribe(result => {
      this.dashBoardDTO.tempUserPlot = result.data;
      this.dashBoardDTO.tempAllPlotRows.forEach((mainDataPlots, i) => {
        this.dashBoardDTO.tempUserPlot.forEach((subDataplots, j) => {
          if (mainDataPlots.id === subDataplots.plotId) {
            mainDataPlots.checked = true;
          }
        });
      },
        (error) => {
          this.dashboardService.loading = false;
          this.notify.showError(error.message);
        });
      this.dashBoardDTO.plotRows = this.dashBoardDTO.tempAllPlotRows;
      this.dashBoardDTO.plotTotalRecords = this.dashBoardDTO.plotRows.length;
      this.dashboardService.loading = false;
    });
  }

  getChartsByTechnology(selectedTechnology: any) {
    this.dashboardService.loading = true;
    this.chartsService.getAllChartsbytechnology(selectedTechnology).subscribe(result1 => {
      this.dashboardService.loading = false;
      result1.data.forEach(data => {
        data.status = this.commonService.getStatus(data);
      });
      this.dashBoardDTO.tempAllChartRows = result1.data;
      this.getUserChart(selectedTechnology);


    });
  }
  getUserChart(selectedTechnology: any) {
    this.dashboardService.loading = true;

    this.dashboardService.getUserChart(selectedTechnology, this.dashBoardDTO.userId).subscribe(result => {

      this.dashBoardDTO.tempUserChart = result.data;
      // compare for select
      this.dashBoardDTO.tempAllChartRows.forEach((mainData, i) => {
        this.dashBoardDTO.tempUserChart.forEach((subData, j) => {
          if (mainData.id === subData.chartId) {
            mainData.checked = true;
          }
        });
      },
        (error) => {
          this.dashboardService.loading = false;
          this.notify.showError(error.message);
        });
      this.dashBoardDTO.chartRows = this.dashBoardDTO.tempAllChartRows;
      this.dashBoardDTO.chartTotalRecords = this.dashBoardDTO.chartRows.length;
      this.dashboardService.loading = false;
    });
  }
  checkBoxSelectChart(favcharts: any) {
    this.dashBoardDTO.saveChanges = false;

  }
  checkBoxSelectPlot(favPlots: any) {
    this.dashBoardDTO.saveChanges = false;
    this.dashBoardDTO.favPlots = favPlots;
  }
  closeFlyout() {
    this.dashBoardDTO.chartRows = [];
    this.dashBoardDTO.chartTotalRecords = 0;

    this.dashBoardDTO.plotRows = [];
    this.dashBoardDTO.plotTotalRecords = 0;

  }

  savefavoriteCharts(gridData: any) {
    this.dashBoardDTO.saveFavcharts = [];
    gridData.forEach(data => {
      if (data.checked === true) {
        const tempSaveFavcharts = {
          chartId: data.id,
          userId: this.dashBoardDTO.userId,
          technologyId: data.technologyId,
        };
        this.dashBoardDTO.saveFavcharts.push(tempSaveFavcharts);
      }
    });
    this.dashBoardDTO.loading = true;
    // tslint:disable-next-line:max-line-length
    this.dashboardService.saveFavCharts(this.dashBoardDTO.saveFavcharts, gridData[0].technologyId, this.dashBoardDTO.userId)
      .subscribe(result => {
        this.dashBoardDTO.loading = false;
        this.dashBoardDTO.chartRows = 0;
        const chartflyoutModelClose = document.getElementById('chartFlyout');
        chartflyoutModelClose.click();
        this.notify.showSuccess(result.body.message);
        this.getAllDashbordCharts(this.dashBoardDTO.userId);
      }, error => {
        this.dashBoardDTO.loading = false;
        this.notify.showError(error.message);
      });

  }
  savefavoritePlots(gridData: any) {
    this.dashBoardDTO.saveFavPlots = [];
    gridData.forEach(data => {
      if (data.checked === true) {
        const tempSaveFavplots = {
          plotId: data.id,
          userId: this.dashBoardDTO.userId,
          technologyId: data.technologyId,
        };
        this.dashBoardDTO.saveFavPlots.push(tempSaveFavplots);
      }
    });
    this.dashBoardDTO.loading = true;
    this.dashboardService.saveFavPlots(this.dashBoardDTO.saveFavPlots,
      gridData[0].technologyId, this.dashBoardDTO.userId).subscribe(result => {

        this.dashBoardDTO.loading = false;
        this.dashBoardDTO.plotRows = 0;
        const plotflyoutModelClose = document.getElementById('plotFlyout');
        plotflyoutModelClose.click();
        this.notify.showSuccess(result.body.message);
        this.getAllDashbordPlots(this.dashBoardDTO.userId);
      }, error => {
        this.dashBoardDTO.loading = false;
        this.notify.showError(error.message);
      });
  }


  getAllPlot(selectedTechnology: any) {
    this.dashboardService.getAllPlot(selectedTechnology, this.dashBoardDTO.userId).subscribe(result => {
      this.dashBoardDTO.chartRows = result.data;
      this.dashBoardDTO.chartTotalRecords = this.dashBoardDTO.chartRows.length;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  getPlotRows() {
    this.dashBoardDTO.plotRows = [
      { name: 'plot1', description: 'desc1' },
      { name: 'plot2', description: 'desc2' },
      { name: 'plot3', description: 'desc3' },
      { name: 'plot4', description: 'desc4' },
      { name: 'plot5', description: 'desc5' },
    ];
    this.dashBoardDTO.chartTotalRecords = this.dashBoardDTO.chartRows.length;
  }

  chartFormControl() {
    this.dashBoardDTO.chartForm = this.formBuilder.group({
      technology: new FormControl('')
    });
  }
  plotFormControl() {
    this.dashBoardDTO.plotForm = this.formBuilder.group({
      technology: new FormControl('')
    });
  }
  chartFlyout() {
    this.dashBoardDTO.chartTotalRecords = 0;
    this.dashBoardDTO.chartRows = 0;
    this.dashBoardDTO.chartFlyOut = true;
    this.dashBoardDTO.saveChanges = true;
    this.dashBoardDTO.chartForm.reset();
    this.getTechnologiesChartPlot();
    const selectedTechnology1 = localStorage.getItem('technology');
    this.onTechnologySelect(selectedTechnology1);
  }
  plotFlyout() {
    this.dashBoardDTO.plotTotalRecords = 0;
    this.dashBoardDTO.plotRows = 0;
    this.dashBoardDTO.plotFlyout = true;
    this.dashBoardDTO.saveChanges = true;
    this.dashBoardDTO.plotForm.reset();
    this.getTechnologiesChartPlot();

    const selectedTechnology2 = localStorage.getItem('technology');
    this.onTechnologySelectPlots(selectedTechnology2);

  }
  chooseTechnology(technology: any) {
    if (technology !== undefined) {
      this.dashboardService.showTechnologyHeader = true;
      localStorage.setItem('technology', technology);
      this.dashboardService.setSelectedTechnology(technology);
      this.dashboardService.sendTechnologyFlag(true);
      this.dashboardService.technologyId = technology;
      this.dashBoardDTO.isTechnology = 'none';
      // added all call where tech is null
      this.getTechnologies();
      this.getTechnologiesChartPlot();
      this.getAllDashbordCharts(this.dashBoardDTO.userId);
      this.getAllDashbordPlots(this.dashBoardDTO.userId);
    } else {
      this.dashBoardDTO.isTechnology = 'block';
    }


  }
  ShowHideButton() {
    this.dashBoardDTO.showMainContent = this.dashBoardDTO.showMainContent ? false : true;
  }

  buildForm() {
    this.dashBoardDTO.graphForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
      technology: ['', Validators.required],
    });
    this.dashBoardDTO.graphForm.setValidators(Validators.compose([Validators.required,
    Validators.maxLength(40), linValidator('description'), Validators.pattern(SPACE_REGEXP)]));
    this.dashBoardDTO.reportForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
      technology: ['', Validators.required],
    });
    this.dashBoardDTO.reportForm.setValidators(Validators.compose([Validators.required,
    Validators.maxLength(40), linValidator('description'), Validators.pattern(SPACE_REGEXP)]));
    this.dashBoardDTO.dashboardTechnologyForm = this.formBuilder.group({
      technology: ['', Validators.required]
    });
  }

  getTechnologies() {
    this.dashboardService.loading = true;
    const user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    this.dashBoardDTO.technologyList = user.technologyRoles;
    this.dashBoardDTO.technologyList = this.dashBoardDTO.technologyList.filter(val => val.status === StatusEnum.Y);
    this.dashboardService.loading = false;
    this.dashBoardDTO.technologyTick = localStorage.getItem('technology');

  }
  setTemplate() {
    const user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    this.uomService.getTemplateId(user.userId).subscribe(res => {
      localStorage.setItem('templateId', res.data.id);


    });
  }
  getReportList() {


    this.dashboardService.loading = true;
    this.dashboardService.getReportData().subscribe(result => {
      this.dashBoardDTO.reportData = result.data;

      this.dashBoardDTO.reportData.forEach((data, i) => {
        this.dashBoardDTO.technologyList.forEach(technology => {
          if (data.sk === technology.id) {
            data.colorCode = technology.colorCode;
          }
        });

      });
      this.dashBoardDTO.reportList = this.dashBoardDTO.reportData.slice(0, 8);

      this.dashboardService.loading = false;
    }, error => {
      this.dashboardService.loading = false;
    });
  }


  getGraphData() {
    this.dashboardService.loading = true;
    this.dashboardService.getGraphData().subscribe(result => {
      this.dashBoardDTO.graphData = result.data;

      this.dashBoardDTO.graphData.forEach((data, i) => {
        this.dashBoardDTO.technologyList.forEach(technology => {
          if (data.sk === technology.id) {
            data.colorCode = technology.colorCode;
          }
        });

      });
      this.dashBoardDTO.graphList = this.dashBoardDTO.graphData.slice(0, 8);

      this.dashboardService.loading = false;
    }, error => {
      this.dashboardService.loading = false;
    });
  }

  toggleReport() {
    this.dashBoardDTO.togglereportList = !this.dashBoardDTO.togglereportList;
    if (!this.dashBoardDTO.togglereportList) {
      this.toggleFlag = this.dashBoardDTO.togglereportList;
      this.dashBoardDTO.allChart = this.dashBoardDTO.allChartFull.slice(0, 9);
    } else {
      this.toggleFlag = this.dashBoardDTO.togglereportList;
      this.dashBoardDTO.allChart = this.dashBoardDTO.allChartFull;
    }

  }



  toggleGraph() {
    this.dashBoardDTO.togglegraphList = !this.dashBoardDTO.togglegraphList;
    if (!this.dashBoardDTO.togglegraphList) {
      this.toggleGraphFlag = this.dashBoardDTO.togglegraphList;
      this.dashBoardDTO.allPlot = this.dashBoardDTO.allPlotFull.slice(0, 9);
    } else {
      this.toggleGraphFlag = this.dashBoardDTO.togglegraphList;
      this.dashBoardDTO.allPlot = this.dashBoardDTO.allPlotFull;
    }
  }
  redirect(link: string): void {
    window.open(link);
  }

  openModel(id: any) {
    if (id === 2) {
      this.dashBoardDTO.hideButton = true;
      this.dashBoardDTO.reportForm.reset();
      this.report = new Report();
    } else {
      this.dashBoardDTO.hideDeleteButton = true;
      this.dashBoardDTO.graphForm.reset();
      this.graph = new Grpah();
    }
  }

  onCancel(id: any) {
    if (Number(id) === 1) {
      this.dashBoardDTO.graphForm.reset();
      this.report = new Report();
      this.getGraphData();
    } else {
      this.dashBoardDTO.reportForm.reset();
      this.graph = new Grpah();
      this.getReportList();
    }
  }
  getTechnologiesChartPlot() {
    const selectedTechnology = localStorage.getItem('technology');
    this.dashBoardDTO.techidSelected = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.dashBoardDTO.technologyListChartPlot = result.data;
      this.dashBoardDTO.technologyListChartPlot.forEach(data => {
        // tslint:disable-next-line:no-unused-expression
        if (data.technologyId === this.dashBoardDTO.techidSelected) {
          this.dashBoardDTO.SelectedTechnologyName = data.technologyName;
          this.report.technologyId = data.technologyId;
        }
      });
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }
}
