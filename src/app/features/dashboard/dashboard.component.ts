import { Component, OnInit } from '@angular/core';
import { DashboardData } from 'src/app/model/model-classes.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { environment } from 'src/environments/environment';
import {DecimalPipe} from '@angular/common';


@Component({
  selector: 'app-dashboard',
  //imports: [DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  implements OnInit{


  dashboard!: DashboardData;
  currency = environment.currency;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getDashboard()
      .subscribe(data => {
        this.dashboard = data;
      });
  }

  getTodayGrowth(): number {
    if (!this.dashboard) return 0;

    return (
      ((this.dashboard.salesSnapshot.todaySales -
        this.dashboard.salesSnapshot.yesterdaySales)
        / this.dashboard.salesSnapshot.yesterdaySales) * 100
    );
  }

  getWeekGrowth(): number {
    if (!this.dashboard) return 0;

    return (
      ((this.dashboard.salesSnapshot.weekSales -
        this.dashboard.salesSnapshot.lastWeekSales)
        / this.dashboard.salesSnapshot.lastWeekSales) * 100
    );
  }


}