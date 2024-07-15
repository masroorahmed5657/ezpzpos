import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ReportsService } from '../services/reports.service';
import { OrderSaleReport, OrderSaleReportResponse  } from '../model/model-classes.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';

//import { ChartOptions } from './qurbani/qurbani.component';
import {
  ApexResponsive,
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { Router } from '@angular/router';

export type ChartOptions = {
  responsive: ApexResponsive[];
  series: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  title?: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  markers: any; //ApexMarkers;
};


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  faSignOut = faSignOut;
  selectedMonth: any;
  filteredMonthlyItems: any;

  filteredYearlyItems: any;
  selectedYear: any;



  startDate: Date = new Date();
  endDate: Date = new Date();

  weekdata = 1;
  dailySaleList: OrderSaleReport[] = [];
  weeklySaleList: OrderSaleReport[] = [];
  monthlySaleList: OrderSaleReport[] = [];
  yearlySaleList: OrderSaleReport[] = [];
  orderSaleReport: OrderSaleReport[] = [];
  sortOrder: 'asc' | 'desc' = 'asc'; //



  chart!: ChartComponent;
  public chart1Options: Partial<ChartOptions> | any;


  series: ApexAxisChartSeries = [];

  title = 'angular-app';
  fileName = 'ExcelSheet.xlsx';




  openPDF(): void {
    let DATA: any = document.getElementById('excel-table');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  yearlyFlag = false;
  monthlyFlag = false;
  weeklyflage = false;
  dailyFlage = true; //default


  constructor(
    private reportsService: ReportsService,
    private router: Router) { }

  ngOnInit(): void {

    this.getReports();


  }

  /* ******************************************************* */

  changeReports(data: any) {
    if (data == "yearly") {
      this.yearlyFlag = true;
      this.monthlyFlag = false;
      this.weeklyflage = false;
      this.dailyFlage = false;
    }

    if (data == "monthly") {
      this.yearlyFlag = false;
      this.monthlyFlag = true;
      this.weeklyflage = false;
      this.dailyFlage = false;
    }

    if (data == "yearly") {
      this.yearlyFlag = true;
      this.monthlyFlag = false;
      this.weeklyflage = false;
      this.dailyFlage = false;
    }
    if (data == "weekly") {
      this.yearlyFlag = false;
      this.monthlyFlag = false;
      this.weeklyflage = true;
      this.dailyFlage = false;
    }

    if (data == "daily") {
      this.yearlyFlag = false;
      this.monthlyFlag = false;
      this.weeklyflage = false;
      this.dailyFlage = true;
    }

    this.getReports();

  }
  /* ****************************************************** */
  getReports() {
    if (this.dailyFlage) {
      //get Daily Sales
      this.reportsService.getDailySale().subscribe((data: OrderSaleReportResponse) => {
        //this.dailySaleList=data;

        this.dailySaleList = data.orderSaleReport;

        this.makeChartDaily();

      });
    }
    if (this.weeklyflage) {
      //get weekly Sales
      this.reportsService.weeklySaleTotal().subscribe((data: OrderSaleReportResponse) => {
        this.weeklySaleList = data.orderSaleReport;

        this.makeChartWeekly();

      });
    }
    if (this.monthlyFlag) {
      //get monthly Sales
      this.reportsService.getMonthlySale().subscribe((data: OrderSaleReportResponse) => {
        this.monthlySaleList = data.orderSaleReport;

        this.makeChartMonthly();



      });
    }
    if (this.yearlyFlag) {
      //get yearly Sales
      this.reportsService.getYearlySale().subscribe((data: OrderSaleReportResponse) => {
        this.yearlySaleList = data.orderSaleReport;
      });

    }

  }

    /* ************************************************************ */
    makeChartDaily() {
      /* ******* 1- No of Orders Chart ********** */
  
      //this.series.
      let saleArray = [];
      for (let i = 0; i < this.dailySaleList.length; i++) {
        saleArray.push((this.dailySaleList[i].totalSale).toFixed(2));
      }
  
      let x_axis = [];
      for (let i = 0; i < this.dailySaleList.length; i++) {
        let xLabel = this.dailySaleList[i].orderType ;
        x_axis.push(xLabel);
      }
  
  
      this.chart1Options = {
        series: [
          {
            name: "SALE",
            data: saleArray,
            label: { text: "$" }
          }
        ],
        chart: {
          height: 350,
          type: "bar"
        },
        title: {
          text: "Sale ($) Chart"
        },
        xaxis: {
          categories: x_axis 
  
        }
      };
  
  
    }
  /* ************************************************************ */
  makeChartWeekly() {
    /* ******* 1- No of Orders Chart ********** */

    //this.series.
    let saleArray = [];
    for (let i = 0; i < this.weeklySaleList.length; i++) {
      saleArray.push((this.weeklySaleList[i].totalSale).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.weeklySaleList.length; i++) {
      let xLabel = this.weeklySaleList[i].dayStr ;
      x_axis.push(xLabel);
    }


    this.chart1Options = {
      series: [
        {
          name: "SALE",
          data: saleArray,
          label: { text: "$" }
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Sale ($) Chart"
      },
      xaxis: {
        categories: x_axis 

      }
    };


  }

  /* ************************************************************ */
  makeChartMonthly() {
    /* ******* 1- No of Orders Chart ********** */

    //this.series.
    let saleArray = [];
    for (let i = 0; i < this.monthlySaleList.length; i++) {
      saleArray.push((this.monthlySaleList[i].totalSale).toFixed(2));
    }

    let monthArray = [];
    for (let i = 0; i < this.monthlySaleList.length; i++) {
      let xLabel = this.monthlySaleList[i].month + ' (' + this.monthlySaleList[i].year + ')';
      monthArray.push(xLabel);
    }


    this.chart1Options = {
      series: [
        {
          name: "SALE",
          data: saleArray,
          label: { text: "$" }
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Sale ($) Chart"
      },
      xaxis: {
        categories: monthArray //["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep", "Oct", "Nov", "Dec"] //this.monthlySaleList.map(r => {x: r.month  }  )

      }
    };


  }

  /* ******************************************************* */
  populateDailySaleList(data: any): OrderSaleReportResponse {

    let saleReport: OrderSaleReportResponse = new OrderSaleReportResponse();

    if (data !== undefined) {
      if (data !== null) {



      }


    }

    return saleReport;

  }


  /* ******************************************************* */

  //sort dialy order items
  sortItems() {
    if (this.sortOrder === 'asc') {
      this.dailySaleList.sort((a, b) => a.totalCount - b.totalCount);
    } else {
      this.dailySaleList.sort((a, b) => b.totalCount - a.totalCount);
    }
  }

  /* ******************************************************* */
  //sort weekly order sales

  filterAndSortItemsWeekly() {
    let t1 = this.weekdata;
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - t1);
    //     const filteredItems = this.weeklySaleList.filter(item => item.date >= oneWeekAgo && item.date <= currentDate);
    // this.weeklySaleList = filteredItems.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  /* ******************************************************* */

  filterAndSortItemsMonthly() {
    if (!this.selectedMonth) {
      // Handle the case when no month is selected
      return;
    }

    const selectedDate = new Date(this.selectedMonth);
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    // this.filteredMonthlyItems = this.monthlySaleList
    //   .filter(item => item.date >= startOfMonth && item.date <= endOfMonth)
    //   .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  /* ******************************************************* */

  filterAndSortItemsYearly() {
    if (!this.selectedYear) {
      // Handle the case when no year is selected
      return;
    }

    const startOfYear = new Date(this.selectedYear, 0, 1);
    const endOfYear = new Date(this.selectedYear, 11, 31);

    // this.filteredYearlyItems = this.yearlySaleList
    //   .filter(item => item.date >= startOfYear && item.date <= endOfYear)
    //   .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

/* ************************************************************** */
signOut() {
  //this.cache.set('currentUser', null);
  sessionStorage.removeItem('currentUser');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('username');

  sessionStorage.clear();

  //this.cache.resetAllData();

  //this.isLoggedIn = false;
  // if (this.isLoggedIn) {
  //   //this.loginService.logOutUser();
  //   //this.serverLogout();
  // }
  this.router.navigate(['login']);
}



}


