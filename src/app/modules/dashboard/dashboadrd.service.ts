import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../../core/services/http/http.service';
import { map } from 'rxjs/operators';
import { CommonService } from '../../shared/common-services/common.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboadrdService {
  loading: boolean;
  sideBarData: any;
  showTechnologyHeader: any;
  technologyId: any;
  selectedTechnology: any;
  private selectedTechnology$ = new BehaviorSubject(null);
  currentTechnology = this.selectedTechnology$ as Observable<any>;

  private hideFlag = new BehaviorSubject(false);
  sendFlag = this.hideFlag as Observable<boolean>;

  private isTechnologySelected$ = new BehaviorSubject(false);
  isTechnologySelected = this.isTechnologySelected$ as Observable<boolean>;

 

  showSideBar: boolean;
  constructor(private commonService: CommonService,

    private http: HttpService) { }

  sendHideFlag(flag: boolean) {
    this.showSideBar = flag;
    this.hideFlag.next(flag);

  }
  getsidebarFlag() {
    return this.showSideBar;
  }
  setLocalStorage(privilageData) {
    localStorage.setItem('privilage', privilageData);

  }
  getLocalStorage() {
    return localStorage.getItem('privilage');
  }

  getTechnologies() {
    const user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj'))
    );
    return this.http.get(`${environment.user_api_url}${environment.gettechnologies}/${user.userId}`).pipe(
      map(data => data)
    );
  }

  getSuperAdminTechnologies() {
    return this.http.get(`${environment.menu_api_url}${environment.getSuperAdminTechnologies}`).pipe(
      map(data => data)
    );
  }


  saveReport(data: any) {
    return this.http.create(`${environment.menu_api_url}${environment.report}`, data).pipe(res => res);
  }
  updateReport(data: any) {
    return this.http.update(`${environment.menu_api_url}${environment.report}`, data).pipe(res => res);
  }
  saveGraph(data: any) {
    return this.http.create(`${environment.menu_api_url}${environment.graph}`, data).pipe(res => res);
  }
  updateGraph(data: any) {
    return this.http.update(`${environment.menu_api_url}${environment.graph}`, data).pipe(res => res);
  }

  update(data: any) {
    return this.http.update('', data).pipe(res => res);
  }

  getReportById(id: string) {
    return this.http.get(`${environment.menu_api_url}${environment.report}/${id}`).pipe(res => res);
  }
  getGraphById(id: string) {
    return this.http.get(`${environment.menu_api_url}${environment.graph}/${id}`).pipe(res => res);
  }

  deleteReport(id: string, skId: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(`${environment.menu_api_url}${environment.report}/${id}/${skId}`).pipe(res => res);
  }
  deleteGraph(id: string, skId: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(`${environment.menu_api_url}${environment.graph}/${id}/${skId}`).pipe(res => res);
  }

  getGraphData() {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${environment.menu_api_url}${environment.graph}`).pipe(map(data => data));
  }

  getReportData() {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${environment.menu_api_url}${environment.report}`).pipe(map(data => data));
  }




  getUserChart(id: any, userId: any) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${environment.plot_api_url}${environment.getUserChart}/${id}/${ userId }`)
      .pipe(map(data => data));
  }
  getUserPlot(id: any, userId: any) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${environment.plot_api_url}${environment.getUserPlot}/${id}/${userId}`)
      .pipe(map(data => data));
  }
  getAllPlot(id: any, userId: any) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${environment.plot_api_url}${ environment.getUserChart }?technologyId=${ id }'&userId='${ userId }`)
      .pipe(map(data => data));
  }
  getAllDashbordCharts(userId: any) {

    // tslint:disable-next-line:max-line-length
    return this.http.get(`${environment.plot_api_url}${ environment.getUserChart}/${ environment.getUserChartTechnologyByUserId}/${ userId } `).pipe(map(data => data));
  }
  getAllDashbordPlots(userId: any) {

    // tslint:disable-next-line:max-line-length
    return this.http.get(`${environment.plot_api_url}${ environment.getUserPlot}/${ environment.getUserPlotTechnologyByUserId}/${ userId }`).pipe(map(data => data));
  }
  updateFavCharts(chart) {
    // tslint:disable-next-line:max-line-length
    return this.http.update(`${ environment.plot_api_url}${ environment.getUserChart}`, chart).pipe(res => res);
  }
  saveFavCharts(chart, id, userId) {

    // tslint:disable-next-line:max-line-length
    return this.http.create(`${environment.plot_api_url}${ environment.getUserChart}/${id}/${userId}`, chart).pipe(res => res);
  }
  saveFavPlots(plot, id, userId) {

    // tslint:disable-next-line:max-line-length
    return this.http.create(`${ environment.plot_api_url}${ environment.getUserPlot}/${id}/${userId} `, plot).pipe(res => res);
  }

  sendTechnologyFlag(flag: boolean) {
    this.isTechnologySelected$.next(flag);
  }
  setSelectedTechnology(technology: any) {
    this.selectedTechnology$.next(technology);
  }
}
