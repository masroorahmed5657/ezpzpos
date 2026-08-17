import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { ReportsService } from '../services/reports.service';
import { InvoiceSummary, OrderSaleDailyReport, OrderSaleReport, OrderSaleReportResponse, PaymentMethodReport, PaymentMethodResponse, ProfitReport, ProfitReportResponse, ReportRequest } from '../model/model-classes.model';
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

  @ViewChild("chart")
  public chartPaymentCountOptions: Partial<ChartOptions> | any;

  @ViewChild("chart")
  public chartPaymentAmountOptions: Partial<ChartOptions> | any;

  @ViewChild("chart")
  public chartPaymentTaxesOptions: Partial<ChartOptions> | any;


  faSignOut = faSignOut;
  selectedMonth: any;
  filteredMonthlyItems: any;

  filteredYearlyItems: any;
  selectedYear: any;
  legacyReport: boolean = false;
  posUrl = '/' + environment.posUrl;



  startDate: Date = new Date();
  endDate: Date = new Date();
  startTime: any;
  endTime: any;

  weekdata = 1;
  dailySaleList: OrderSaleReport[] = [];
  weeklySaleList: OrderSaleReport[] = [];
  monthlySaleList: OrderSaleReport[] = [];
  yearlySaleList: OrderSaleReport[] = [];
  orderSaleReport: OrderSaleReport[] = [];
  dailySaleExcelReport: OrderSaleDailyReport[] = [];

  dailySaleCashReport: OrderSaleDailyReport[] = [];
  dailySaleCardReport: OrderSaleDailyReport[] = [];


  cashCardSaleReport: PaymentMethodResponse = new PaymentMethodResponse;
  totalCashSaleCount = 0;
  totalCashTax = 0;
  totalCashSaleAmount = 0;
  totalCardSaleCount = 0;
  totalCashCardSaleCount = 0;
  totalCashCardSaleAmount = 0;
  totalCashCardTax = 0;
  totalCardTax = 0;
  totalCardSaleAmount = 0;
  ///////////////////////////////////////////////////
  dailySaleExcelReturnReport: OrderSaleDailyReport[] = [];
  dailyReturnCashReport: OrderSaleDailyReport[] = [];
  dailyReturnCardReport: OrderSaleDailyReport[] = [];

  profitReportResponse: ProfitReportResponse = new ProfitReportResponse();
  profitReportList: ProfitReport[] = [];
  invoiceMap = new Map<string, InvoiceSummary>();


  totalCashReturnCount = 0;
  totalCashReturnTax = 0;
  totalCashReturnAmount = 0;
  totalCardReturnCount = 0;
  totalCashCardReturnCount = 0;
  totalCashCardReturnAmount = 0;
  totalCashCardReturnTax = 0;
  totalCardReturnTax = 0;
  totalCardReturnAmount = 0;


  //////////////////////////////////////////////////
  paymentMethodReport: PaymentMethodReport = new PaymentMethodReport();

  sortOrder: 'asc' | 'desc' = 'asc'; //
  showTaxFlag = environment.showTaxFlag;


  chart!: ChartComponent;
  public chart1Options: Partial<ChartOptions> | any;


  series: ApexAxisChartSeries = [];

  title = 'angular-app';
  fileName = 'DailySale.xlsx';
  totalCashProfit: number=0;
  totalCardProfit: number=0;
  totalProfit: number=0;


  print() {
    let printWindow: any;
    if (this.legacyReport) {
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
     <body  onload="window.print()" onafterprint="window.close()">  
     `;



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


  openPDF(): void {

    if (this.legacyReport) {
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
      //return-table
      let DATA3: any = document.getElementById('return-table');
      html2canvas(DATA3).then((canvas) => {
        let fileWidth = 208;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save('return-sale.pdf');
      });

    }
    else {
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
    if (this.legacyReport) {
      /* pass here the table id */
      let element = document.getElementById('cash-table');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, 'DailyCashSale.xlsx');

      /* pass here the table id */
      let element2 = document.getElementById('card-table');
      const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element2);

      /* generate workbook and add the worksheet */
      const wb2: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb2, ws2, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb2, 'DailyCardSale.xlsx');

      /* pass here the table id */
      let elementRet = document.getElementById('return-table');
      const wsRet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(elementRet);

      /* generate workbook and add the worksheet */
      const wbRet: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wbRet, wsRet, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wbRet, 'DailyReturnSale.xlsx');

    }
    else {
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
  /* ************************* INIT ********************************************** */

  constructor(private route: ActivatedRoute,
    private reportsService: ReportsService,
    private router: Router) { }

  ngOnInit(): void {

    this.totalCashProfit = 0;
    this.totalCardProfit = 0;
    this.totalProfit = 0;


    let reportType = this.route.snapshot.paramMap.get('reportType');

    //this.startDate=null;
    //this.endDate=null;


    if (reportType === 'false') {
      this.legacyReport = true;
    }
    else {
      this.legacyReport = false;
    }

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



  }

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
    if (this.legacyReport) {
      let orderType = 'POS';
      this.dailySaleCashReport.length = 0;
      this.dailySaleCardReport.length = 0;
      this.dailyReturnCashReport.length = 0;
      this.dailyReturnCardReport.length = 0;

      this.reportsService.getDailySaleExcel(orderType).subscribe((data: OrderSaleReportResponse) => {
        this.dailySaleExcelReport = data.orderSaleDailyReport;
        this.dailySaleExcelReturnReport = data.orderSaleDailyReturnReport;


        this.totalCashSaleCount = data.totalCashSaleCount;
        this.totalCashTax = data.totalCashTax;
        this.totalCashSaleAmount = data.totalCashSaleAmount;

        this.totalCardSaleCount = data.totalCreditSaleCount;
        this.totalCardTax = data.totalCreditTax;
        this.totalCardSaleAmount = data.totalCreditSaleAmount


        this.totalCashCardSaleCount = this.totalCashSaleCount + this.totalCardSaleCount;
        this.totalCashCardTax = this.totalCashTax + this.totalCardTax;
        this.totalCashCardSaleAmount = this.totalCashSaleAmount + this.totalCardSaleAmount;


        //Code added on July 21, 2024 to summarize profit report by invoice number
      let reportRequest: ReportRequest = new ReportRequest();
      reportRequest.startDate = null;


        this.reportsService.getProfitWithDates(reportRequest).subscribe((data: ProfitReportResponse) => {
          let profitList: Map<string, number> = new Map<string, number>();

          this.profitReportResponse = data;
          this.profitReportList = data.profitReportList;
          this.getProfitSummary();


        //Now segregate Cash and Card records
        for (let i = 0; i < this.dailySaleExcelReport.length; i++) {
          if (this.dailySaleExcelReport[i].paymentMethod === 'CASH') {
            //this.totalCashTax += this.dailySaleExcelReport[i].tax;
            //this.totalCashSaleAmount += this.dailySaleExcelReport[i].grandTotal;

            this.dailySaleCashReport.push(this.dailySaleExcelReport[i]);
            this.totalCashProfit+=this.getProfit(this.dailySaleExcelReport[i].invoiceNumber);
          }
          else if (this.dailySaleExcelReport[i].paymentMethod === 'CARD') {
            //this.totalCardTax += this.dailySaleExcelReport[i].tax;
            //this.totalCardSaleAmount += this.dailySaleExcelReport[i].grandTotal;

            this.dailySaleCardReport.push(this.dailySaleExcelReport[i]);
            this.totalCardProfit+=this.getProfit(this.dailySaleExcelReport[i].invoiceNumber);
          }
          this.totalProfit=this.totalCashProfit+this.totalCardProfit;

        }//for loop


        ////////////////////////////////////////////////////////////////////////////////////
        ////// RETURN REPORT //////////////////
        ///////////////////////////////////////////////////////////////////////////////////
        for (let i = 0; i < this.dailySaleExcelReturnReport.length; i++) {
          if (this.dailySaleExcelReturnReport[i].paymentMethod === 'RETURN') {
            this.totalCashReturnTax += this.dailySaleExcelReturnReport[i].tax;
            this.totalCashReturnAmount += this.dailySaleExcelReturnReport[i].grandTotal;

            this.dailyReturnCashReport.push(this.dailySaleExcelReturnReport[i]);
          }

        }//for loop
        this.totalCashReturnCount = this.dailyReturnCashReport.length;
        //this.totalCardReturnCount = this.dailyReturnCardReport.length;

        this.totalCashCardReturnCount = this.dailyReturnCashReport.length;//+ this.dailyReturnCardReport.length;
        this.totalCashCardReturnTax = this.totalCashReturnTax;//+ this.totalCardReturnTax;
        this.totalCashCardReturnAmount = this.totalCashReturnAmount;// + this.totalCardReturnAmount;

        });
      });

    }
    else {
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
    for (let i = 0; i < this.dailySaleList.length; i++) {
      saleArray.push((this.dailySaleList[i].totalSale).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.dailySaleList.length; i++) {
      let xLabel = this.dailySaleList[i].orderType;
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
    let st1 = (this.startDate).toString();
    let st2 = (this.endDate).toString();
    this.startDate;
    if ((this.startDate).toString() > (this.endDate).toString()) {
      Swal.fire('WARNING', 'End Date must be greater or equal to Start Date', 'warning');
      this.startDate = new Date();
    }


  }

  endDateChange() {
    this.endDate;
    if ((this.startDate).toString() > (this.endDate).toString()) {
      Swal.fire('WARNING', 'End Date must be greater or equal to Start Date', 'warning');
      this.endDate = new Date();
    }
  }
  startTimeChange() {

  }

  endTimeChange() {

  }

  dailyReportWithDate() {
    if (this.legacyReport) {
      let orderType = 'POS';

      let reportRequest: ReportRequest = new ReportRequest();
      reportRequest.startDate = (this.startDate).toString();


      if (this.startTime === undefined) {
        reportRequest.startTime = "";
      }
      else {
        reportRequest.startTime = (this.startTime).toString();
      }

      reportRequest.endDate = (this.endDate).toString();

      if (this.endTime === undefined) {
        reportRequest.endTime = "";
      }
      else {
        reportRequest.endTime = (this.endTime).toString();
      }

      reportRequest.reportType = 'POS';
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



      this.reportsService.getDailySaleDetailWithDateRange(orderType, reportRequest).subscribe((data: OrderSaleReportResponse) => {
        //this.dailySaleList=data;
        //this.dailySaleList=data;

        this.dailySaleExcelReport = data.orderSaleDailyReport;
        this.dailySaleExcelReturnReport = data.orderSaleDailyReturnReport;


        this.totalCashSaleCount = data.totalCashSaleCount;
        this.totalCashTax = data.totalCashTax;
        this.totalCashSaleAmount = data.totalCashSaleAmount;

        this.totalCardSaleCount = data.totalCreditSaleCount;
        this.totalCardTax = data.totalCreditTax;
        this.totalCardSaleAmount = data.totalCreditSaleAmount


        this.totalCashCardSaleCount = this.totalCashSaleCount + this.totalCardSaleCount;
        this.totalCashCardTax = this.totalCashTax + this.totalCardTax;
        this.totalCashCardSaleAmount = this.totalCashSaleAmount + this.totalCardSaleAmount;

        //Code added on July 21, 2024 to summarize profit report by invoice number
        this.reportsService.getProfitWithDates(reportRequest).subscribe((data: ProfitReportResponse) => {
          let profitList: Map<string, number> = new Map<string, number>();

          this.profitReportResponse = data;
          this.profitReportList = data.profitReportList;
          this.getProfitSummary();


       // });




        //Now segregate Cash and Card records
        for (let i = 0; i < this.dailySaleExcelReport.length; i++) {
          if (this.dailySaleExcelReport[i].paymentMethod === 'CASH') {
            //this.totalCashTax += this.dailySaleExcelReport[i].tax;
            //this.totalCashSaleAmount += this.dailySaleExcelReport[i].grandTotal;

            this.dailySaleCashReport.push(this.dailySaleExcelReport[i]);
            //Get Cash Profit
            this.totalCashProfit+=this.getProfit(this.dailySaleExcelReport[i].invoiceNumber);


          }
          else if (this.dailySaleExcelReport[i].paymentMethod === 'CARD') {
            //this.totalCardTax += this.dailySaleExcelReport[i].tax;
            //this.totalCardSaleAmount += this.dailySaleExcelReport[i].grandTotal;

            this.dailySaleCardReport.push(this.dailySaleExcelReport[i]);
            this.totalCardProfit+=this.getProfit(this.dailySaleExcelReport[i].invoiceNumber);
          }

          this.totalProfit = this.totalCashProfit + this.totalCardProfit;

        }//for loop

      
        ////////////////////////////////////////////////////////////////////////////////////
        ////// RETURN REPORT //////////////////
        ///////////////////////////////////////////////////////////////////////////////////
        for (let i = 0; i < this.dailySaleExcelReturnReport.length; i++) {
          if (this.dailySaleExcelReturnReport[i].paymentMethod === 'RETURN') {
            this.totalCashReturnTax += this.dailySaleExcelReturnReport[i].tax;
            this.totalCashReturnAmount += this.dailySaleExcelReturnReport[i].grandTotal;

            this.dailyReturnCashReport.push(this.dailySaleExcelReturnReport[i]);
          }
         

        }//for loop
        this.totalCashReturnCount = this.dailyReturnCashReport.length;
        //this.totalCardReturnCount = this.dailyReturnCardReport.length;

        this.totalCashCardReturnCount = this.dailyReturnCashReport.length;//+ this.dailyReturnCardReport.length;
        this.totalCashCardReturnTax = this.totalCashReturnTax;//+ this.totalCardReturnTax;
        this.totalCashCardReturnAmount = this.totalCashReturnAmount;// + this.totalCardReturnAmount;

        });//Daily Sale Profit Report

      });


    }//end if

  }

  /* ******************************************************* */
  /**
   * Code added on July 21, 2024 to summarize profit report by invoice number
   * This method groups the profit report items by invoice number and calculates the total unit price, total purchase price, and total total price for each invoice.
   * The summarized data is stored in a new list called invoiceSummaryList.
   */
  getProfitSummary() {
    //const invoiceMap = new Map<string, InvoiceSummary>();

    this.profitReportList.forEach(item => {

      const key = item.invoiceNumber.toUpperCase().trim();

      if (!this.invoiceMap.has(key)) {
        this.invoiceMap.set(key, {
          invoiceNumber: key,
          totalUnitPrice: 0,
          totalPurchasePrice: 0,
          totalTotalPrice: 0
        });
      }

      const invoice = this.invoiceMap.get(key)!;
      invoice.totalUnitPrice += item.unitPrice;
      invoice.totalPurchasePrice += item.purchasePrice;
      invoice.totalTotalPrice += item.totalPrice;
      //this.totalCashProfit += item.totalPrice - item.purchasePrice;
    });

    //console.log(this.invoiceMap);

    const invoiceSummaryList: InvoiceSummary[] = Array.from(this.invoiceMap.values());

    console.log(invoiceSummaryList);
  }

  getInvoiceMapValue(key:any): InvoiceSummary | undefined {
    return this.invoiceMap.get(key);

  }

  getProfit(key:any): number{
    const invoice = this.invoiceMap.get(key);
    let profit: number = 0;

    profit= invoice ? invoice.totalTotalPrice - invoice.totalPurchasePrice : 0;
    
    return profit;
  

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


  /* ************************ END ********************* */
}


