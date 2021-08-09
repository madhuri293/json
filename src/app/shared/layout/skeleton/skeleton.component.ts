import { Component, OnInit } from '@angular/core';
import { DashboadrdService } from '../../../modules/dashboard/dashboadrd.service';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html'
})
export class SkeletonComponent implements OnInit {

  constructor(private dashboardService: DashboadrdService) { }

  ngOnInit() {
  }

}
