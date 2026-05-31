import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { ReportsService } from '../../services/reports.service';
import { CategorySalePrice, CategorySaleResponse, OrderSaleDailyReport, OrderSaleReport, OrderSaleReportResponse, PaymentMethodReport, PaymentMethodResponse, ProductSaleResponse, ProductsSalePrice, ReportRequest } from '../../model/model-classes.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
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
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

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
  selector: 'app-zreport',
  templateUrl: './zreport.component.html',
  styleUrls: ['./zreport.component.scss']
})
export class ZreportComponent implements OnInit {

  @ViewChild("chart")
  public chartPaymentCountOptions: Partial<ChartOptions> | any;

  @ViewChild("chart")
  public chartPaymentAmountOptions: Partial<ChartOptions> | any;

  @ViewChild("chart")
  public chartPaymentTaxesOptions: Partial<ChartOptions> | any;


  faSignOut = faSignOut;
  selectedMonth: any;
  filteredMonthlyItems: any;

  currency = environment.currency;
  showCloseSale: boolean=false;

  filteredYearlyItems: any;
  selectedYear: any;
  summaryReportFlag: boolean = true;
  posUrl = environment.posUrl; //'/posRestaurant';// + environment.posRestaurant;

  startDate: Date | null = null; //new Date();
  endDate: Date | null = null; // new Date();
  startTime: any;
  endTime: any;

  weekdata = 1;
  dailySaleList: OrderSaleReport[] = [];
  weeklySaleList: OrderSaleReport[] = [];
  monthlySaleList: OrderSaleReport[] = [];
  yearlySaleList: OrderSaleReport[] = [];
  orderSaleReport: OrderSaleReport[] = [];
  dailySaleExcelReport: OrderSaleDailyReport[] = [];
  dailySaleExcelReturnReport: OrderSaleDailyReport[] = [];

  dailySaleDetailReport: OrderSaleDailyReport[] = [];
  dailySaleDetailReturnReport: OrderSaleDailyReport[] = [];

  
  dailySaleCashReport: OrderSaleDailyReport[] = [];
  dailySaleCardReport: OrderSaleDailyReport[] = [];
  dailyReturnCashReport: OrderSaleDailyReport[] = [];
  dailyReturnCardReport: OrderSaleDailyReport[] = [];

  cashCardSaleReport: PaymentMethodResponse = new PaymentMethodResponse;

  totalSaleCount = 0;
  totalTax = 0;
  totalSaleAmount = 0;
  totalDiscount = 0;
  totalNetSale = 0;
  totalCashSaleCount = 0;
  totalCashTax = 0;
  totalCashSaleAmount = 0;
  totalCardSaleCount = 0;
  totalCashCardSaleCount = 0;
  totalCashCardSaleAmount = 0;
  totalCashCardTax = 0;
  totalCardTax = 0;
  totalCardSaleAmount = 0;
  totalCashReturnCount = 0;
  totalCashReturnTax = 0;
  totalCashReturnAmount = 0;
  totalCardReturnCount = 0;
  totalCashCardReturnCount = 0;
  totalCashCardReturnAmount = 0;
  totalCashCardReturnTax = 0;
  totalCardReturnTax = 0;
  totalCardReturnAmount = 0;

  yearlyFlag = false;
  monthlyFlag = false;
  weeklyflage = false;
  dailyFlage = true; //default
  orderType = 'PICKUP';

  restaurantFlag: boolean = environment.restaurantFlag;


  //////////////////////////////////////////////////
  paymentMethodReport: PaymentMethodReport = new PaymentMethodReport();

  sortOrder: 'asc' | 'desc' = 'asc'; //
  showTaxFlag = environment.showTaxFlag;


  chart!: ChartComponent;
  public chart1Options: Partial<ChartOptions> | any;


  series: ApexAxisChartSeries = [];

  title = 'angular-app';
  fileName = 'DailySale.xlsx';


  /* *********************************************** */

  print() {
    let printWindow: any;
    // if (this.summaryReportFlag)
    {
      const printContentObj = document.getElementById('saleReport');
      const printContent = printContentObj?.innerHTML;
      const originalContent = document.body.innerHTML;


      printWindow = window.open('', '_blank');

      let headHtmlTag = `
      <html> 
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge"> `;

      let styleTag = `
     <style>
     @media print {
            .no-print { display: none; }
            .page-break {page-break-after: always;
			}

      table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          thead {border: 2px solid black;background-color:none;}
     </style>
     `;

      let bodyHtmlTag =
        `<title>Daily Sale Report</title>
     </head>    
     <body  onload="window.print()" onafterprint="window.close()">`;



      let footerHtml =
        `</body>
     </html>
       `;

      let finalHTMLTag = headHtmlTag + styleTag + bodyHtmlTag + printContent + footerHtml;
      printWindow.document.open();
      printWindow.document.write(finalHTMLTag);

      printWindow.document.close();
      //printWindow.focus();
      //printWindow.print();  

    }
  }

  /* *********************************************** */
  openPDF(): void {

    //if (this.summaryReportFlag) 
    {
      let DATA: any = document.getElementById('saleReport');
      html2canvas(DATA).then((canvas) => {
        let fileWidth = 208;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save('saleReport.pdf');
        PDF.autoPrint();
      });

    }
  }
  /* *********************************************** */
  exportexcel(): void {
    //    if (this.summaryReportFlag) 
    {
      /* pass here the table id */
      let element = document.getElementById('saleReport');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, 'DailyCashSale.xlsx');


    }
    // else {
    //   /* pass here the table id */
    //   let element = document.getElementById('excel-table');
    //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    //   /* generate workbook and add the worksheet */
    //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    //   /* save to file */
    //   XLSX.writeFile(wb, this.fileName);


    // }


  }
  /* *********************************************** */
  /* ************************* INIT ********************************************** */

  constructor(private route: ActivatedRoute,
    private reportsService: ReportsService,
    private router: Router) { }

  ngOnInit(): void {


    let reportType = this.route.snapshot.paramMap.get('reportType');
    

    //this.startDate=null;
    //this.endDate=null;


    //if (reportType === 'false') {
      //this.summaryReportFlag = true;
    // }
    // else {
    //   this.summaryReportFlag = false;
    // }

    let datePipe = new DatePipe('en-US');
    this.startTime = datePipe.transform(new Date(), 'shortTime');
    this.endTime = datePipe.transform(new Date(), 'shortTime');


    this.totalCashSaleCount = 0;
    this.totalCashTax = 0;
    this.totalCashSaleAmount = 0;

    this.totalCardSaleCount = 0;
    this.totalCardTax = 0;
    this.totalCardSaleAmount = 0;


    this.totalCashCardSaleCount = this.totalCashSaleCount + this.totalCardSaleCount;
    this.totalCashCardTax = this.totalCashTax + this.totalCardTax;
    this.totalCashCardSaleAmount = this.totalCashSaleAmount + this.totalCardSaleAmount;

    this.getReports();
    this.getDailySaleDetailWithDateRange();



  }

  /* ******************************************************* */
  ngAfterViewInit(): void {

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
    {
      if (this.dailyFlage) {
        //get Daily Sales
        this.reportsService.getDailySaleByType().subscribe((data: OrderSaleReportResponse) => {
          //this.dailySaleList=data;

          this.totalSaleCount = 0;
          this.totalDiscount = 0;
          this.totalTax = 0;
          this.totalSaleAmount = 0;
          this.totalNetSale = 0;


          this.dailySaleExcelReport = data.orderSaleDailyReport;

          this.dailySaleExcelReport.forEach(item => {
            this.totalSaleCount += item.orderCount;
            this.totalDiscount += item.discount;
            this.totalTax += item.tax;
            this.totalSaleAmount += item.orderAmount;
            this.totalNetSale += item.grandTotal;

          });


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
      this.reportsService.dailySaleTotalCashCreditCount().subscribe((data: PaymentMethodResponse) => {
        this.cashCardSaleReport = data;

        this.paymentMethodReport.cardAmount = data.paymentAmountMap.CARD
        this.paymentMethodReport.cashAmount = data.paymentAmountMap.CASH

        this.paymentMethodReport.cardTax = data.paymentTaxesMap.CARD
        this.paymentMethodReport.cashTax = data.paymentTaxesMap.CASH

        this.paymentMethodReport.cardCount = data.paymentCountMap.CARD
        this.paymentMethodReport.cashCount = data.paymentCountMap.CASH


        this.makeChartPayment();


      });

    }



  }
  /* ******************************************************* */
  makeChartPayment() {

    let countArray = [];

    let count1: number = Math.round(this.paymentMethodReport.cashCount);
    let count2: number = Math.round(this.paymentMethodReport.cardCount);

    countArray.push(count1);
    countArray.push(count2);
    /*    {
      name: "PaymentMethodCount",
      data: countArray,
      label: { text: "$" }
    }*/

    this.chartPaymentCountOptions = {
      series: [45, 20],

      chart: {
        width: 380,
        type: "pie"
      },
      title: {
        text: "Total Payment Count"
      },
      labels: ["CASH", "CARD"],
      dataLabels: {
        enabled: true, // Show data labels
        formatter: (val: number, opts: any) => {
          //return opts.w.config.labels[opts.seriesIndex] + ": " + val + "%";
          // Round the value to 1 decimal place and append a '%' sign
          return `${val.toFixed(1)}%`;
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.chartPaymentCountOptions.series = countArray;

    //////////////////////////////////////////////////////
    let amountArray = [];

    amountArray.push((this.paymentMethodReport.cashAmount));
    amountArray.push((this.paymentMethodReport.cardAmount));


    this.chartPaymentAmountOptions = {
      // series: [{
      //   name: "Payment Method Amount",
      //   data: amountArray,
      //   label: { text: "$" }
      // }],
      series: [
        12345678.90, 445563.23

      ],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["CASH", "CARD"],
      title: {
        text: "Total Payment Amount "
      },
      dataLabels: {
        enabled: true, // Show data labels
        formatter: (val: number, opts: any) => {
          //return opts.w.config.labels[opts.seriesIndex] + ": " + val + "%";
          // Round the value to 1 decimal place and append a '%' sign
          return `${val.toFixed(1)}%`;
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    this.chartPaymentAmountOptions.series = amountArray;
    //////////////////////////////////////////////////////
    let taxesArray = [];

    taxesArray.push(Math.round(this.paymentMethodReport.cashTax));
    taxesArray.push(Math.round(this.paymentMethodReport.cardTax));


    this.chartPaymentTaxesOptions = {
      series: [4533.89, 2314.65
        //   {
        //   name: "Payment Method Taxes",
        //   data: taxesArray,
        //   label: { text: "$" }
        // }
      ],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["CASH", "CARD"],
      title: {
        text: "Total Taxes Paid"
      },
      dataLabels: {
        enabled: true, // Show data labels
        formatter: (val: number, opts: any) => {
          //return opts.w.config.labels[opts.seriesIndex] + ": " + val + "%";
          // Round the value to 1 decimal place and append a '%' sign
          return `${val.toFixed(1)}%`;
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    this.chartPaymentTaxesOptions.series = taxesArray;


  }

  /* ************************************************************ */
  makeChartDaily() {
    /* ******* 1- No of Orders Chart ********** */

    //this.series.
    let saleArray = [];
    for (let i = 0; i < this.dailySaleExcelReport.length; i++) {
      saleArray.push((this.dailySaleExcelReport[i].grandTotal).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.dailySaleExcelReport.length; i++) {
      let xLabel = this.dailySaleExcelReport[i].orderType;
      x_axis.push(xLabel);
    }


    this.chart1Options = {
      series: [
        {
          name: "SALE",
          data: saleArray,
          label: { text: this.currency }
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Sale (" + this.currency + ") Chart"
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
      let xLabel = this.weeklySaleList[i].dayStr;
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
      let xLabel = this.yearlySaleList[i].year;
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

  /* ******************************************************* */

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let t1 = 0;
    switch (event.key) {
      case 'Escape':
        this.router.navigate(['pos']);
        break;

    }
  }

  startDateChange() {
    if (this.startDate && this.endDate) {
      if (this.startDate > this.endDate) {
        Swal.fire('WARNING', 'Start date is after end date', 'warning');

      } else if (this.endDate < this.startDate) {
        Swal.fire('WARNING', 'End date is before Start date', 'warning');
        //console.log('Start date is before end date');
      } else {

        console.log('Dates are equal');
      }
    }


  }

  /* ******************************************************* */
  endDateChange() {
    this.endDate;

    if (this.startDate && this.endDate) {
      if (this.startDate > this.endDate) {
        Swal.fire('WARNING', 'Start date is after end date', 'warning');

      } else if (this.endDate < this.startDate) {
        Swal.fire('WARNING', 'End date is before Start date', 'warning');
        //console.log('Start date is before end date');
      } else {

        console.log('Dates are equal');
      }
    }
  }
  /* ******************************************************* */
  startTimeChange() {

  }
  /* ******************************************************* */
  endTimeChange() {

  }
  /* ******************************************************* */
  searchReportWithDate() {

    this.resetReportList();

    if (this.summaryReportFlag) 
    {
      let orderType = 'EMPTY';

      let reportRequest: ReportRequest = new ReportRequest();

      if (this.startDate !== null) {
        reportRequest.startDate = (this.startDate).toString();
      }
      else {
        reportRequest.startDate = this.startDate;
      }

      if (this.startTime === undefined) {
        reportRequest.startTime = "";
      }
      else {
        reportRequest.startTime = (this.startTime).toString();
      }

      if (this.endDate !== null) {
        reportRequest.endDate = (this.endDate).toString();
      }
      else {
        reportRequest.endDate = this.endDate;
      }

      //reportRequest.endDate = (this.endDate).toString();

      if (this.endTime === undefined) {
        reportRequest.endTime = "";
      }
      else {
        reportRequest.endTime = (this.endTime).toString();
      }

      reportRequest.reportType = 'EMPTY';

      this.reportsService.getDailySaleExcelWithDateRange(orderType, reportRequest).subscribe((data: OrderSaleReportResponse) => {
        //this.dailySaleList=data;
        //this.dailySaleList=data;

        this.totalSaleCount = 0;
        this.totalDiscount = 0;
        this.totalTax = 0;
        this.totalSaleAmount = 0;
        this.totalNetSale = 0;

        this.dailySaleExcelReport = data.orderSaleDailyReport;

        this.dailySaleExcelReport.forEach(item => {
          this.totalSaleCount += item.orderCount;
          this.totalDiscount += item.discount;
          this.totalTax += item.tax;
          this.totalSaleAmount += item.grandTotal;
          this.totalNetSale += (item.grandTotal + item.tax);

        });

        this.makeChartDaily()

      });

    }
    else{
      this.getDailySaleDetailWithDateRange();
    }

  }
  /* ******************************************************* */
  toNumber(amount: any) {

    if (amount === undefined) {
      return 0;
    }
    else if (amount === 0) {
      return 0;
    }
    else if (amount > 0) {
      let numVal = Number(amount.toFixed(2)).toLocaleString('en');

      return numVal;

    }
    else if (amount < 0) {
      //Returns
      let numVal = Number(amount.toFixed(2)).toLocaleString('en');

      return numVal;

    }

    else {
      return amount;
    }

  }

  /* ************************************************ */
  salesReportExcel(summaryReportFlag: boolean) {


    this.summaryReportFlag = summaryReportFlag;
    let url = 'reports/' + summaryReportFlag;
    this.router.navigate([url]);

  }

toggleReports(){
  if (this.summaryReportFlag){
    this.summaryReportFlag=false;
  }
  else{
    this.summaryReportFlag=true;
  }
}

closeSale(){

}


  /* ************************************************ */
  getDailySaleDetailWithDateRange() {
   // this.summaryReportFlag = summaryReportFlag;
    // if (this.summaryReportFlag) {
      // let orderType = this.orderType;

      let reportRequest: ReportRequest = new ReportRequest();
      reportRequest.startDate = this.startDate //|| this.startDate.toISOString() ; //(this.startDate).toString();


      if (this.startTime === undefined) {
        reportRequest.startTime = "";
      }
      else {
        reportRequest.startTime = (this.startTime).toString();
      }

      reportRequest.endDate = this.endDate; //this.endDate.toISOString(); // (this.endDate).toString();

      if (this.endTime === undefined) {
        reportRequest.endTime = "";
      }
      else {
        reportRequest.endTime = (this.endTime).toString();
      }

      reportRequest.reportType = this.orderType;
      this.dailySaleCashReport.length = 0;
      this.dailySaleCardReport.length = 0;
      this.totalCashSaleAmount = 0;
      this.totalCashTax = 0;
      this.totalCardTax = 0;
      this.totalCardSaleAmount = 0;

      this.dailyReturnCashReport.length = 0;
      this.dailyReturnCardReport.length = 0;
      this.totalCashReturnAmount = 0;
      this.totalCashReturnTax = 0;
      this.totalCardReturnTax = 0;
      this.totalCardReturnAmount = 0;



      this.reportsService.getDailySaleDetailWithDateRange(this.orderType, reportRequest).subscribe((data: OrderSaleReportResponse) => {
        //this.dailySaleList=data;
        //this.dailySaleList=data;

        this.dailySaleDetailReport = data.orderSaleDailyReport;
        this.dailySaleDetailReturnReport = data.orderSaleDailyReturnReport;


        this.totalCashSaleCount = data.totalCashSaleCount;
        this.totalCashTax = data.totalCashTax;
        this.totalCashSaleAmount = data.totalCashSaleAmount;

        this.totalCardSaleCount = data.totalCreditSaleCount;
        this.totalCardTax = data.totalCreditTax;
        this.totalCardSaleAmount = data.totalCreditSaleAmount


        this.totalCashCardSaleCount = this.totalCashSaleCount + this.totalCardSaleCount;
        this.totalCashCardTax = this.totalCashTax + this.totalCardTax;
        this.totalCashCardSaleAmount = this.totalCashSaleAmount + this.totalCardSaleAmount;


        this.dailySaleDetailReport.forEach(item =>{

        })


        //Now segregate Cash and Card records
        for (let i = 0; i < this.dailySaleDetailReport.length; i++) {
          if (this.dailySaleDetailReport[i].paymentMethod === 'CASH') {

            this.dailySaleCashReport.push(this.dailySaleDetailReport[i]);
          }
          else if (this.dailySaleDetailReport[i].paymentMethod === 'CARD') {

            this.dailySaleCardReport.push(this.dailySaleDetailReport[i]);
          }

        }//for loop


        ////////////////////////////////////////////////////////////////////////////////////
        ////// RETURN REPORT //////////////////
        ///////////////////////////////////////////////////////////////////////////////////
        for (let i = 0; i < this.dailySaleDetailReturnReport.length; i++) {
          if (this.dailySaleDetailReturnReport[i].paymentMethod === 'RETURN') {
            this.totalCashReturnTax += this.dailySaleDetailReturnReport[i].tax;
            this.totalCashReturnAmount += this.dailySaleDetailReturnReport[i].grandTotal;

            this.dailyReturnCashReport.push(this.dailySaleDetailReturnReport[i]);
          }

        }//for loop
        this.totalCashReturnCount = this.dailyReturnCashReport.length;
        //this.totalCardReturnCount = this.dailyReturnCardReport.length;

        this.totalCashCardReturnCount = this.dailyReturnCashReport.length;//+ this.dailyReturnCardReport.length;
        this.totalCashCardReturnTax = this.totalCashReturnTax;//+ this.totalCardReturnTax;
        this.totalCashCardReturnAmount = this.totalCashReturnAmount;// + this.totalCardReturnAmount;


      });

    // }

  }

  /* **************************************** */

  resetReportList() {
    this.dailySaleList = [];
    this.weeklySaleList = [];
    this.monthlySaleList = [];
    this.yearlySaleList = [];
    this.orderSaleReport = [];
    this.dailySaleExcelReport = [];

    this.dailySaleCashReport = [];
    this.dailySaleCardReport = [];
    this.dailySaleExcelReturnReport = [];
    this.dailyReturnCashReport = [];
    this.dailyReturnCardReport = [];

    this.cashCardSaleReport = new PaymentMethodResponse;

    this.totalSaleCount = 0;
    this.totalTax = 0;
    this.totalSaleAmount = 0;
    this.totalDiscount = 0;
    this.totalNetSale = 0;
    this.totalCashSaleCount = 0;
    this.totalCashTax = 0;
    this.totalCashSaleAmount = 0;
    this.totalCardSaleCount = 0;
    this.totalCashCardSaleCount = 0;
    this.totalCashCardSaleAmount = 0;
    this.totalCashCardTax = 0;
    this.totalCardTax = 0;
    this.totalCardSaleAmount = 0;
    this.totalCashReturnCount = 0;
    this.totalCashReturnTax = 0;
    this.totalCashReturnAmount = 0;
    this.totalCardReturnCount = 0;
    this.totalCashCardReturnCount = 0;
    this.totalCashCardReturnAmount = 0;
    this.totalCashCardReturnTax = 0;
    this.totalCardReturnTax = 0;
    this.totalCardReturnAmount = 0;

  }


  /* ************************************************************* */
  home() {

    this.router.navigate(['/home']);
  }

  posHome(){
    this.router.navigate([this.posUrl]);
  }

totalSaleCountProd = 0;
totalDiscountProd = 0;
totalTaxProd = 0;
totalSaleAmountProd = 0;
totalNetSaleProd = 0;

totalSaleCountCat = 0;
totalDiscountCat = 0;
totalTaxCat = 0;
totalSaleAmountCat = 0;
totalNetSaleCat = 0;
dailySaleReport: OrderSaleDailyReport[] = [];
saleByCategoryTotalReport: CategorySalePrice[] = [];
saleByProductTotalReport: ProductsSalePrice[] = [];


printDailyCloseSale(){

    let bRet = false;
    let currency = environment.currency;
    let totalSaleCount = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let totalSaleAmount = 0;
    let totalNetSale = 0;
    this.showCloseSale=true;


    this.totalSaleCountProd = 0;
    this.totalDiscountProd = 0;
    this.totalTaxProd = 0;
    this.totalSaleAmountProd = 0;
    this.totalNetSaleProd = 0;

    this.totalSaleCountCat = 0;
    this.totalDiscountCat = 0;
    this.totalTaxCat = 0;
    this.totalSaleAmountCat = 0;
    this.totalNetSaleCat = 0;



    try {

      this.reportsService.getDailySaleByType().subscribe((dailyData: OrderSaleReportResponse)=>{
        this.dailySaleReport = dailyData.orderSaleDailyReport;
        // 👉 your existing calculations here (unchanged)
        this.dailySaleReport.forEach(item => {
        totalSaleCount += item.orderCount;
        totalDiscount += item.discount;
        totalTax += item.tax;
        totalSaleAmount += item.grandTotal;
        totalNetSale += (item.grandTotal + item.tax);

      });


      });

      this.reportsService.categoryTotalSale().subscribe((categoryData: CategorySaleResponse)=>{
        this.saleByCategoryTotalReport = categoryData.catSale;

        this.saleByCategoryTotalReport.forEach(item => {
          this.totalSaleCountCat += item.noOfOrders;
          this.totalTaxCat += item.totalTax;
          this.totalDiscountCat += item.totalDiscount;
          this.totalSaleAmountCat += item.salePrice;
          this.totalNetSaleCat += (item.salePrice + item.totalTax);
          });

      this.reportsService.productTotalSale().subscribe((productData: ProductSaleResponse)=>{
          this.saleByProductTotalReport = productData.sale;

          this.saleByProductTotalReport.forEach(item => {
          this.totalSaleCountProd += item.noOfOrders;
          this.totalTaxProd += item.totalTax;
          this.totalDiscountProd += item.totalDiscount;
          this.totalSaleAmountProd += item.salePrice;
          this.totalNetSaleProd += (item.salePrice + item.totalTax);
          });

      });

      });






    } catch (error) {
      console.error('Error in printDailyCloseSale:', error);
      bRet = false;
    }

    
  }
  




  /* ************************ END ********************* */
}
/*
| Order Type | Orders | Sales  | Tax  | Discount | Net Sales |
| ---------- | ------ | ------ | ---- | -------- | --------- |
| Dine-In    | 45     | $1,250 | $125 | $50      | $1,325    |
| Pickup     | 20     | $420   | $42  | $10      | $452      |
| Delivery   | 15     | $510   | $51  | $20      | $541      |



*/

