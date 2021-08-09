import { Component, OnInit } from '@angular/core';
import { HttpService } from './core/services/http/http.service';
import { DashboadrdService } from './modules/dashboard/dashboadrd.service';
import { CommonService } from './shared/common-services/common.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private http: HttpService, private dashboardService: DashboadrdService, private commonService: CommonService) { }

  ngOnInit() {
    this.dashboardService.showTechnologyHeader = true;
    this.dashboardService.technologyId = localStorage.getItem('technology');

  }
}
