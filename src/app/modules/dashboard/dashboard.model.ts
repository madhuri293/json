import { FormGroup } from '@angular/forms';
import { LocalStorageSave } from '../../core/services/cache/cache.service';

export class Report {
  id: string;
  reportName: string;
  description: string;
  technologyId: string;
  sk: string;
}

export class Grpah {
  id: string;
  graphName: string;
  description: string;
  technologyId: string;
  sk: string;

}

export class DashBoardDTO {
  SelectedTechnologyName: any;
  showMainContent: boolean = true;
  technologyList: any;
  pathList: any;
  localStorageData: LocalStorageSave = new LocalStorageSave();
  privilageList: any;
  navigatePath: any;
  user: any;
  graphForm: FormGroup;
  reportForm: FormGroup;
  dashboardTechnologyForm: FormGroup;
  dashBoardDataList: any;
  openModal = false;
  openGmodal = false;
  toggleFlag = false;
  hideButton: boolean;
  hideDeleteButton: boolean;
  reportList: any;
  togglegraphList: boolean;
  togglereportList: boolean;
  graphList: any;
  graphData: any;
  reportData: any;
  sideMenus: any = [];
  saveChanges: boolean = true;

  dashboardTechnology: any;
  loading: boolean;
  isTechnology: any;
  userId: any;
  chartFlyOut: boolean;
  plotFlyout: boolean;
  chartForm: FormGroup;
  chartColumns: any = [];
  chartRows: any = [];
  chartTotalRecords: any;
  chartnOfRecordPage: any;
  favcharts: any;
  allChart: any;
  plotForm: FormGroup;
  favPlots: any;
  allPlot: any;
  plotColumns: any = [];
  plotRows: any = [];
  plotTotalRecords: any;
  plotnOfRecordPage: any;
  chartId: any;
  technologyId: any;
  saveFavcharts: any = [];
  saveFavPlots: any = [];
  tempAllChartRows: any;
  tempUserChart: any;
  tempUserPlot: any;
  tempAllPlotRows: any;
  technologyListChartPlot: any;
  allChartFull: any;
  allPlotFull: any;
  techidSelected: any;
  technologyTick:any;
}
