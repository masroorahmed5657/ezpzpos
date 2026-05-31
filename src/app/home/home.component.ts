import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { faClose, faPrint, faList, faCloudUpload, faCloudDownload, faPerson, faCreditCard, faCashRegister, faPlusSquare, faDashboard, faRemove, faRupeeSign, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from '../services/cache.service';
import { CustomerService } from '../services/customer.service';
import { DepartmentsService } from '../services/departments.service';
import { LoginService } from '../services/login.service';
import { OrdersService } from '../services/orders.service';
import { PaymentService } from '../services/payment.service';
import { PrintService } from '../services/print.service';
import { ProductService } from '../services/product.service';
import { ReportsService } from '../services/reports.service';
import { UserService } from '../services/user.service';
import { AdminUser, CashierShift, OrderResponse, Orders, OrderSaleDailyReport, OrderSaleReportResponse, Payment, PriceSummary, RestaurantTable } from '../model/model-classes.model';
import { RestaurantService } from '../services/restaurant.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {


  faCreditCard = faCreditCard;
  faCashRegister = faCashRegister;
  faPrint = faPrint;
  faList = faList;
  faClose = faClose;
  faPerson = faPerson;
  faSignOut = faSignOut;
  closeBalanceFlag = false;

  selectedAgent: any;
  logoName = environment.logoName;
  posTime: string = '00:00:00';
  seconds = 0;
  public isLoggedIn = false;
  disablePOSFlag = false;
  salesAgentList: AdminUser[] = [];
  showOpenBalanceFlag = environment.showOpenBalanceFlag;
  showDineInFlag = environment.showDineInFlag;
  showDeliveryFlag = environment.showDeliveryFlag;
  cashierShift: CashierShift = new CashierShift();
  tablesList: RestaurantTable[] = [];
  tablesMasterList: RestaurantTable[] = [];
  carList: RestaurantTable[] = [];
  selectedTable!: RestaurantTable;// = new RestaurantTable();
  cartsByTable: { [tableId: number]: any } = {};
  selectedTableId: number = 1;
  priceSummaryByTable: PriceSummary[] = [];

  priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
    grandTotal: 0,
    totalQty: 0,
    totalWithoutDiscount: 0,
    totalItems: 0,
    taxesPercentage: 0,
    discountPercentage: 0,
  };
  payment: Payment = new Payment();

  //Report Variables
  totalSaleCount: number = 0;
  totalDiscount: number = 0;
  totalTax = 0;
  totalSaleAmount = 0;
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
  dailySaleExcelReport: OrderSaleDailyReport[] = [];

  /* ************************************************************* */



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService,
    private productService: ProductService,
    private departmentsService: DepartmentsService,
    private orderService: OrdersService,
    private customerService: CustomerService,
    private userService: UserService,
    private paymentService: PaymentService,
    private reportsService: ReportsService,
    private loginService: LoginService,
    private printService: PrintService,
    private restaurantService: RestaurantService

  ) { }

  /* ************************************************************ */
  ngOnInit(): void {

    setInterval(() => {
      this.seconds++;
      this.posTime = this.formatTime(this.seconds);
    }, 1000);


    /* ************** Sales Agent ******************************* */
    //Get from Cache
    let salesAgentCache = localStorage.getItem('salesAgent');
    let salesAgentSelectedCache = localStorage.getItem('selectedAgent');
    if (salesAgentCache) {
      this.salesAgentList = JSON.parse(salesAgentCache);

    }
    

    if (this.salesAgentList === undefined || this.salesAgentList === null || this.salesAgentList.length === 0) {
      this.userService.getUserList().subscribe((data: AdminUser[]) => {
        //this.salesAgentList = data;
        if (data !== undefined) {
          if (data.length > 0) {
            this.salesAgentList = [];
            for (let i = 0; i < data.length; i++) {
              let userRole = data[i].userRole;
              if (userRole === 'AGENT') {
                this.salesAgentList.push(data[i]);
              }
            }
            if (this.salesAgentList.length > 0 && this.selectedAgent === undefined) {
              this.selectedAgent = this.salesAgentList[0].userId;
            }
            else if (this.salesAgentList.length > 0 && this.selectedAgent === null) {
              this.selectedAgent = this.salesAgentList[0].userId;
            }
          }
        }


        this.cache.setList("salesAgent", this.salesAgentList);

        if (this.salesAgentList.length > 0 && this.selectedAgent === undefined) {
          if (salesAgentSelectedCache) {
          this.selectedAgent = (JSON.parse(salesAgentSelectedCache)).userId;
        }
        else {
          this.selectedAgent = this.salesAgentList[0].userId;
        }
        }
        else if (this.salesAgentList.length > 0 && this.selectedAgent === null) {
         if (salesAgentSelectedCache) {
          this.selectedAgent = (JSON.parse(salesAgentSelectedCache)).userId;
        }
        else {
          this.selectedAgent = this.salesAgentList[0].userId;
        }
        }

        this.cache.setList("selectedAgent", this.salesAgentList[0]);
        //First Time when get from Database
        this.onAgentChange(this.selectedAgent);

        //Get Tables
        let restaurantTablesObj = localStorage.getItem('restaurantTables');

        if (!restaurantTablesObj){
          //Not in Cache, get the list from DB
          this.restaurantService.getTables().subscribe((data: RestaurantTable[]) => {
            this.tablesMasterList = data;

            localStorage.setItem('restaurantTables', JSON.stringify(data));

            //Filter by Agent Selected
            this.tablesList = this.tablesMasterList.filter(table => table.userId === this.selectedAgent);

          });

        }
        else{
          this.tablesMasterList = JSON.parse(restaurantTablesObj);
            //Filter by Agent Selected
          this.tablesList = this.tablesMasterList.filter(table => table.userId === this.selectedAgent);

        }

      });

    }
    else {
      if (this.salesAgentList.length > 0 && this.selectedAgent === undefined) {
        if (salesAgentSelectedCache) {
          this.selectedAgent = (JSON.parse(salesAgentSelectedCache)).userId;
        }
        else {
          this.selectedAgent = this.salesAgentList[0].userId;
        }
     
      }
      else if (this.salesAgentList.length > 0 && this.selectedAgent === null) {
        if (salesAgentSelectedCache) {
          this.selectedAgent = (JSON.parse(salesAgentSelectedCache)).userId;
        }
        else {
          this.selectedAgent = this.salesAgentList[0].userId;
        }

      }

        //Get Tables
        let restaurantTablesObj = null ; //localStorage.getItem('restaurantTables');

        if (!restaurantTablesObj){
          //Not in Cache, get the list from DB
          this.restaurantService.getTables().subscribe((data: RestaurantTable[]) => {
            this.tablesMasterList = data;

            localStorage.setItem('restaurantTables', JSON.stringify(data));

            //Filter by Agent Selected
            this.tablesList = this.tablesMasterList.filter(table => table.userId === this.selectedAgent);

          });

        }
        else{
          this.tablesMasterList = JSON.parse(restaurantTablesObj);
            //Filter by Agent Selected
          this.tablesList = this.tablesMasterList.filter(table => table.userId === this.selectedAgent);

        }

    }

    //this.onAgentChange(this.selectedAgent);

    /* ****************** Cash Register *********************** */
    let cashRegisterObj: any = sessionStorage.getItem('cashierShift');

    if (this.showOpenBalanceFlag) {
      if (cashRegisterObj === '' || cashRegisterObj === undefined || cashRegisterObj === null) {
        Swal.fire('Warning', 'Sale for Today has been closed. Please logout or print XReport', 'warning');
        this.disablePOSFlag = true;
        this.showOpenBalanceFlag = false;
        return;
      }

    }
    this.cashierShift = JSON.parse(cashRegisterObj);

    // this.restaurantService.getTables().subscribe((data: RestaurantTable[]) => {
    //   this.tablesMasterList = data;

    //   localStorage.setItem('restaurantTables', JSON.stringify(data));
    //   //.map(table => {

    //   // const agent = this.salesAgentList.find(
    //   //   a => a.userId === table.userId
    //   // );

    //   // return {
    //   //   ...table,
    //   //   agentName: agent 
    //   //     ? `${agent.loginId} - ${agent.firstName}` 
    //   //     : 'N/A'
    //   // };


    //   //Filter by Agent Selected
    //   this.tablesList = this.tablesMasterList.filter(table => table.userId === this.selectedAgent);

    //   // Filter only CAR type tables
    //   // this.carList = this.tablesMasterList.filter(table => table.tableType?.toUpperCase() === 'CAR');


    // });



    //});



  }
  /* ************************************************************* */
  formatTime(totalSeconds: number): string {

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return (
      this.pad(hrs) + ':' +
      this.pad(mins) + ':' +
      this.pad(secs)
    );
  }
  /* ************************************************************* */
  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }


  onAgentChange(agentId: number) {
    console.log('Selected Agent:', agentId);
    this.selectedAgent = Number(agentId);

    // Apply filter
    //&& (table.tableType==='TABLE')
    this.tablesList = this.tablesMasterList.filter(table => (table.userId === this.selectedAgent));

    const agentFound = this.salesAgentList.find(agent => {
      return agent.userId === this.selectedAgent;
    });

    this.cache.setList("selectedAgent", agentFound);


    let len = this.tablesList.length;
  }

  /* ************************************************************* */

  dineIn() {
    this.router.navigate(['/posDinein/1']);
  }
  /* ************************************************************* */
  delivery() {

    this.router.navigate(['/posDelivery']);
  }
  /* ************************************************************* */
  deliveryDashboard() {

    this.router.navigate(['/posDeliveryDashboard']);
  }

  /* ******************************************************* */
  lastBillOfSale() {


    this.orderService.getLastBillOfSale().subscribe((data: OrderResponse) => {
      if (data !== undefined) {

        let orderCustomer = data.orderCustomer;
        if (orderCustomer !== null) {
          let orders: any = new Orders();
          if (data.orderCustomer.length > 0) {
            orders = data.orderCustomer[0].orders;
            let customer: any = data.orderCustomer[0]?.customer;
            let orderItems = data.orderItems;

            //@@TODO
            // this.printThermalLastBill(orders, customer, orderItems);

          }
          else {
            Swal.fire('WARNING', 'No Last Bill of Sale Found', 'warning')
            return;
          }

        }
        else {
          Swal.fire('WARNING', 'No Last Bill of Sale Found', 'warning')
          return;
        }

      }
      else {
        Swal.fire('WARNING', 'No Last Bill of Sale Found', 'warning')
        return;
      }

    });


  }

  /* ************************************************************* */

  closeBalance() {
    this.closeBalanceFlag = true;
  }



  zReport() {
    let url = 'zReport';
    this.router.navigate([url]);
  }

  /* ************************************************************** */
  pickup() {

    this.router.navigate(['/posRestaurant']);
  }

  /* ************************************************************** */
  signOut() {
    this.cache.set('currentUser', null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    sessionStorage.clear();

    this.cache.resetAllData();

    this.isLoggedIn = false;
    if (this.isLoggedIn) {
      //this.loginService.logOutUser();
      //this.serverLogout();
    }
    this.router.navigate(['login']);
  }

  /* ************************************************************** */
  closeBalancePopup() {

    this.loginService.saveCloseBalance(this.cashierShift).subscribe(async (data) => {
      if (data.shiftId !== null) {
        //print sale report
        // this.getDailySale();
        const response = await this.printService.printDailyCloseSale();

        console.log('Response from print:' + response);

        if (response) {
          sessionStorage.setItem('cashierShift', '');
          window.location.reload();

        }

      }

      this.closeBalanceFlag = false;
    });


  }
  /* **************************************************************** */


  getDailySale() {
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
        this.totalSaleAmount += item.grandTotal;
        this.totalNetSale += (item.grandTotal + item.tax);

      });


    });


  }



  selectTable(table: any) {

    this.selectedTableId = table.tableId ;
    localStorage.setItem('selectedTableId', this.selectedTableId.toString());
    this.router.navigate(['/posDinein/' + this.selectedTableId]);

    // if (table.status === 'AVAILABLE') {
    //   let currentOrder = 0//this.createOrder(table);
    //   //table.status = 'OCCUPIED';

    //   this.selectedTableId = table.tableId;



    //   if (!this.cartsByTable[table.tableId]) {
    //     this.cartsByTable[table.tableId] = {
    //       items: [],
    //       status: 'OCCUPIED',
    //       priceSummary: this.priceSummary,
    //       order: currentOrder,
    //       payment: this.payment,
    //       orderNotes: ''
    //     };
    //   }

    //   // this.restaurantService.changeTableStatus(table).subscribe((data)=>{
    //   //   let resp = data;
    //   // });

    // }
    // else {
    //   this.selectedTableId = table.tableId;
    // }

    // localStorage.setItem('selectedTableId', this.selectedTableId.toString());

  }
  /* ************************************************* */
  getTableStatus(tableId: number) {
    return this.cartsByTable[tableId]?.items?.length > 0
      ? 'OCCUPIED'
      : 'AVAILABLE';
  }


}
