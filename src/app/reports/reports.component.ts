import { Component, HostListener, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ReportsService } from '../services/reports.service';
import { OrderSaleDailyReport, OrderSaleReport, OrderSaleReportResponse  } from '../model/model-classes.model';
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
import { ActivatedRoute, Router } from '@angular/router';

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
  legacyReport:boolean=false;



  startDate: Date = new Date();
  endDate: Date = new Date();

  weekdata = 1;
  dailySaleList: OrderSaleReport[] = [];
  weeklySaleList: OrderSaleReport[] = [];
  monthlySaleList: OrderSaleReport[] = [];
  yearlySaleList: OrderSaleReport[] = [];
  orderSaleReport: OrderSaleReport[] = [];
  dailySaleExcelReport: OrderSaleDailyReport[]=[];
  dailySaleCashReport: OrderSaleDailyReport[]=[];
  dailySaleCardReport: OrderSaleDailyReport[]=[];
  totalCashSaleCount=0;
  totalCashTax=0;
  totalCashSaleAmount=0;
  totalCardSaleCount=0;
  totalCardTax=0;
  totalCardSaleAmount=0;

  sortOrder: 'asc' | 'desc' = 'asc'; //



  chart!: ChartComponent;
  public chart1Options: Partial<ChartOptions> | any;


  series: ApexAxisChartSeries = [];

  title = 'angular-app';
  fileName = 'DailySale.xlsx';



  print(){
    let popupWin:any ;
    if (this.legacyReport){
      let cashHtml: any = document.getElementById('cash-table');
      let cardHtml: any = document.getElementById('card-table');
      popupWin = window.open('', '_blank');
      
      let headHtmlTag = `
      <html> 
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge"> `;

    let styleTag=`
     <style>
     @media print {
            .no-print { display: none; }
            .page-break {page-break-after: always;
			}
     </style>
     `;
      
     let bodyHtmlTag  =
     `<title>Niks Receipt</title>
     </head>    
     <body  onload="window.print();window.close();">`;



      let footerHtml=
     `</body>
     </html>
       `;

    let finalHTMLTag =   headHtmlTag +  styleTag + bodyHtmlTag + cashHtml + cardHtml; + footerHtml;
 
     popupWin.document.write(finalHTMLTag);
 
     popupWin.document.close();
       
  
    }
  }


  openPDF(): void {

    if (this.legacyReport){
      let DATA: any = document.getElementById('cash-table');
      html2canvas(DATA).then((canvas) => {
        let fileWidth = 208;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save('cash-sale.pdf');
        PDF.autoPrint();
      });
      let DATA2: any = document.getElementById('card-table');
      html2canvas(DATA2).then((canvas) => {
        let fileWidth = 208;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save('card-sale.pdf');
      });
  
    }
    else{
      let DATA: any = document.getElementById('excel-table');
      html2canvas(DATA).then((canvas) => {
        let fileWidth = 208;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save('daily-sale.pdf');
        
      });
  

    }


  }

  exportexcel(): void {
    if (this.legacyReport){
      /* pass here the table id */
      let element = document.getElementById('cash-table');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, this.fileName);

        /* pass here the table id */
        let element2 = document.getElementById('card-table');
        const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element2);
    
        /* generate workbook and add the worksheet */
        const wb2: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb2, ws2, 'Sheet1');
    
        /* save to file */
        XLSX.writeFile(wb2, this.fileName);
    
    }
    else{
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);


    }


  }

  yearlyFlag = false;
  monthlyFlag = false;
  weeklyflage = false;
  dailyFlage = true; //default


  constructor(private route: ActivatedRoute,
    private reportsService: ReportsService,
    private router: Router) { }

  ngOnInit(): void {

    
    let reportType = this.route.snapshot.paramMap.get('reportType');

    if (reportType==='false'){
      this.legacyReport = true;
    }
    else{
      this.legacyReport = false;
    }

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
    if (this.legacyReport){
      let orderType='POS';
      this.reportsService.getDailySaleExcel(orderType).subscribe((data: OrderSaleReportResponse) => {
        //this.dailySaleList=data;

        this.dailySaleExcelReport = data.orderSaleDailyReport;
        //Now segregate Cash and Card records
        for (let i=0; i<this.dailySaleExcelReport.length; i++){
          if (this.dailySaleExcelReport[i].paymentMethod === 'CASH'){
            this.totalCashTax += this.dailySaleExcelReport[i].tax;
            this.totalCashSaleAmount += this.dailySaleExcelReport[i].grandTotal;

            this.dailySaleCashReport.push(this.dailySaleExcelReport[i]);
          }
          else if (this.dailySaleExcelReport[i].paymentMethod === 'CARD'){
            this.totalCardTax += this.dailySaleExcelReport[i].tax;
            this.totalCardSaleAmount += this.dailySaleExcelReport[i].grandTotal;

            this.dailySaleCardReport.push(this.dailySaleExcelReport[i]);
          }

        }//for loop
        this.totalCashSaleCount = this.dailySaleCashReport.length;
        this.totalCardSaleCount = this.dailySaleCardReport.length;


      });

    }
    else{
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
          this.makeChartYearly();
        });
  
      }
  

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

  /* ************************************************************ */
  makeChartYearly() {
    /* ******* 1- No of Orders Chart ********** */

    //this.series.
    let saleArray = [];
    for (let i = 0; i < this.yearlySaleList.length; i++) {
      saleArray.push((this.yearlySaleList[i].totalSale).toFixed(2));
    }

    let yearArray = [];
    for (let i = 0; i < this.yearlySaleList.length; i++) {
      let xLabel = this.yearlySaleList[i].year ;
      yearArray.push(xLabel);
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
        categories: yearArray 

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


@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  let t1=0;
  switch (event.key) {
    case 'Escape':
      this.router.navigate(['pos']);
      break;

    }
  }

}


