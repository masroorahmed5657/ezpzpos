import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { faSignOut, faClose, faPrint, faList, faCloudUpload, faCloudDownload, faPerson, faCreditCard, faCashRegister, faPlusSquare, faDashboard, faRemove, faRupeeSign, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
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
import Swal from 'sweetalert2';
import { Customer, OrderResponse, Orders, OrderSaveResponse, OrdersCustomerWrapper, OrderSearch, Payment, PriceSummary } from '../model/model-classes.model';
import { DeliveryService } from '../services/delivery.service';
import { DriverDelivery, Drivers } from '../data-type';


interface DeliveryOrder {
  deliveryId: number;
  orderId: number;
  customerName: string;
  area: string;
  orderTime: string;
  status: string;
  driverName?: string;
}


@Component({
  selector: 'app-delivery-dashboard',
  templateUrl: './delivery-dashboard.component.html',
  styleUrls: ['./delivery-dashboard.component.scss']
})
export class DeliveryDashboardComponent implements OnInit {

  billCopyNumber = environment.billCopyNumber;
  orderType = false;
  customerBalance: number = 0;
  showTaxFlag: boolean = environment.showTaxFlag;
  //cartDataList: CartHold = new CartHold();

  payment: Payment = new Payment();
  result: any = '';
  cashModal: boolean = false;
  orders: DeliveryOrder[] = [];
  orderCustomerList: OrdersCustomerWrapper[] = [];
  faCreditCard = faCreditCard;
  faCashRegister = faCashRegister;
  faPrint = faPrint;
  faList = faList;
  faClose = faClose;
  faSignOut = faSignOut;
  faPerson = faPerson;

  logoName = environment.logoName;
  posTime: string = '00:00:00';
  seconds = 0;

  disablePOSFlag = false;
  closeBalanceFlag = false;
  showOpenBalanceFlag = environment.showOpenBalanceFlag;
  printThermalHTMLTag = '';
  totalSaleCount: number = 0;
  legacyReport: boolean = false;
  taxCouponFlag: boolean = false;
  whatsappFlag: boolean = false;
  showDeliveryFlag = environment.showDeliveryFlag;
  public isLoggedIn = false;
  showDineInFlag = environment.showDineInFlag;


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


  constructor(
    private router: Router,
    private cache: CacheService,
    private orderService: OrdersService,
    private customerService: CustomerService,
    private userService: UserService,
    private paymentService: PaymentService,
    private reportsService: ReportsService,
    private loginService: LoginService,
    private printService: PrintService,
    private deliveryService: DeliveryService

  ) { }


  ngOnInit() {
    this.loadOrders();

    setInterval(() => {
      this.seconds++;
      this.posTime = this.formatTime(this.seconds);
    }, 1000);


    this.payment.paymentMethod='CASH';

    this.loadDrivers();

    // setInterval(() => {
    //   this.loadOrders();
    // }, 5000);

  }

  loadOrders() {

    let orderSearch: OrderSearch = new OrderSearch();

    orderSearch.status = 'NEW';
    orderSearch.orderType = 'DELIVERY';

    this.orderService.getDeliveryOrders(orderSearch).subscribe((data: OrderResponse) => {
      this.orderCustomerList = data.orderCustomer;
      this.orderCustomerList.sort((a,b) => (a.orders?.orderId! - b.orders?.orderId!));
      let i = 0;
    });



    // // Normally call backend API
    // this.orders = [
    //   { deliveryId: 1, orderId: 1023, customerName: 'Ahmed', area: 'Gulshan', orderTime: '5 min', status: 'PREPARING' },
    //   { deliveryId: 2, orderId: 1024, customerName: 'Ali', area: 'Clifton', orderTime: '8 min', status: 'READY' },
    //   { deliveryId: 3, orderId: 1025, customerName: 'Bilal', area: 'DHA', orderTime: '2 min', status: 'OUT_FOR_DELIVERY', driverName: 'Imran' }
    // ];
  }


  markReady(order: any) {
    order.status = "READY";
  }

  markOut(order: any) {
    order.status = "OUT_FOR_DELIVERY";
  }

  markDelivered(order: any) {
    order.status = "DELIVERED";
  }

  /* ****************** Main Menu ******************** */
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

            //@@TODO use printService.printThermal
            //this.printThermalLastBill(orders, customer, orderItems);

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

  /* ************************************************************** */

  closeBalance() {
    this.closeBalanceFlag = true;
  }
  /* ************************************************************** */

  zReport() {
    let url = 'zReport';
    this.router.navigate([url]);
  }

  dineIn() {
    this.router.navigate(['/posDinein']);
  }
  /* ************************************************************** */
  pickup() {

    this.router.navigate(['/posRestaurant']);
  }

  /* ************************************************************* */
  delivery() {

    this.router.navigate(['/posDelivery']);
  }

  /* ***************************************** */

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

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }


  /* ********************************************** */
  updateOrderStatus(orderId: any, newStatus: any) {

    this.orderService.updateOrdersStatus(orderId, newStatus).subscribe((data) => {
      const order = this.orderCustomerList.find(o => o.orders?.orderId === orderId);
      if (order) {
        order.orders!.orderStatus = newStatus;
      }
       window.location.reload();

    });

  }



  /* ************************************************************** */
  closeCashModal() {
    this.cashModal = false;
    this.result = '';
    this.customerBalance = 0;
  }
  /* ******************************************************************************** */
  calculateBalance(): void {

    let cashPaid = parseFloat((this.result)) || 0;
    //let cashDiscount = parseFloat(this.totalDiscount) || 0;
    //this.priceSummary.discount = cashDiscount;
    //let invoiceTotal = Number(this.priceSummary.total) || 0;

    //this.priceSummary.grandTotal = invoiceTotal - (this.priceSummary.tax + cashDiscount);
    // Calculate the balance
    this.customerBalance = cashPaid - (this.registerOrder.grandTotal);

  }
  /* ************************************************************** */
  appendToResult(value: string) {
    this.result += value;
    this.calculateBalance();
  }
  /* ************************************************************** */
  clear() {
    this.result = '';
  }
  /* ************************************************************** */
  backSpace() {
    // Remove the last character from cashPaid
    //this.result = 0; //this.result.slice(0, -1);

    this.result = '';
    this.customerBalance = 0;
  }

  calculate() {
    try {
      this.result = eval(this.result);
    } catch (error) {
      this.result = 'Error';
    }
  }


  /* ******************************************************* */
  registerOrder: Orders = new Orders();
  registerCustomer: Customer = new Customer();
  signInUser: any = '';
  currencyName = environment.currency;
  


  /* ********************************************** */
  payBill(orderId: any) {

    const order = this.orderCustomerList.find(o => o.orders?.orderId === orderId);
    if (order) {
      if (order.orders!.orderStatus === 'PAID') {
        Swal.fire('Warning', 'Order already PAID', 'warning');
        return;
      }
      if (order.orders!.orderStatus === 'CLOSED') {
        Swal.fire('Warning', 'Order already CLOSED', 'warning');
        return;
      }

      if (order.orders!.orderStatus === 'DELIVERED'   ) 
      {

        this.registerOrder = order.orders!;
        this.registerCustomer = order.customer!;

        this.cashModal = true;
        let resultInput = <HTMLInputElement>document.getElementById('result');
        resultInput.focus();
        //this.cashModal.nativeElement.focus();
        if (order.orders!.grandTotal < 0) {

          resultInput.value = '' + order.orders!.grandTotal; //.toFixed(2);
        }
        else {
          resultInput.value = ''; //(0).toFixed(2);
        }
        resultInput.autofocus = true;
        //resultInput.value='0';

        setTimeout(() => {
          let resultInput = <HTMLInputElement>document.getElementById('result');
          resultInput.focus();

        }, 500);

      }
      else {
        Swal.fire('Warning', 'Please Serve the Table before Payment', 'warning');
      }

    }//end if

  }

  /* *********************************************************************************** */
  paymentCheckout() {

    //Check current status, It should be in one of the following:
    //SENT_TO_KITCHEN, PREPARING, SERVED

      let payment: Payment = new Payment();
      let orderSaveResponse: OrderSaveResponse = new OrderSaveResponse();
      this.signInUser = sessionStorage.getItem("username");

      

      ////////////////////////////////////////////////////////
      //Save Orders and Payment

      this.registerOrder.orderStatus = 'CLOSED';
      this.updateOrderStatus(this.registerOrder.orderId, 'CLOSED');

      ///////////////////////////////////////////////////////
      payment.orderId = this.registerOrder.orderId;
      payment.paymentStatus = 'COMPLETED';
      payment.instalmentAmount = 0;
      payment.remainingBalance = 0; //this.cartsByTable[selectedTableId].priceSummary.grandTotal;
      payment.totalAmount = this.registerOrder.grandTotal;
      payment.advanceAmount = 0;
      payment.discount = this.registerOrder.discount;
      payment.paymentMethod = this.payment.paymentMethod;
      payment.taxesAmount = this.registerOrder.tax;
      payment.updatedBy = this.signInUser;
      payment.currency = this.currencyName;
      payment.customerPaid = this.customerBalance;

      this.orderService.savePaymentOnly(payment).subscribe((data: Payment) => {
        if (data.paymentId) {
          //Order cycle completed, customer paid the bill, now Table available again
          // this.printBill(  payment );
          window.location.reload();

          
        }
      });


      this.cashModal = false;

  }

  // /* ********************************************** */
  // printBill() {

  //   let dinInFlag=true;
  //   this.printService.printThermalRestaurant(this.customer, 
  //     this.cartsByTable[this.selectedTableId].payment, 
  //     this.cartsByTable[this.selectedTableId],
  //     this.customerBalance, 
  //     this.cartsByTable[this.selectedTableId].order.invoiceNumber, 
  //     this.printTokenFlag, 
  //     this.todaydatashow, 
  //     this.cartsByTable[this.selectedTableId].orderNotes, 
  //     dinInFlag, 
  //     this.billCopyNumber);


  //   // this.printThermal();

  // }



  /* ************************************************************* */
  home() {

    this.router.navigate(['/home']);
  }

drivers: Drivers[] = [];
selectedDriver: any = null;
showDriverModal: boolean = false;
searchText: string = '';

openDriverModal() {
  this.showDriverModal = true;
  this.loadDrivers();
}

closeDriverModal() {
  this.showDriverModal = false;
  this.selectedDriver = null;
}

selectDriver(driver: any) {
  if (driver.status !== 'AVAILABLE') return; // prevent busy selection
  this.selectedDriver = driver;
}

order: Orders=new Orders();

showAssignDriver(orderId: any){
  this.showDriverModal=true;
  this.order.orderId = orderId;
  this.loadOrders();
}

assignDriver(order: any) {
  if (!this.selectedDriver) return;

  let driverDelivery: DriverDelivery = new DriverDelivery();

  driverDelivery.driverId = this.selectedDriver.driverId;
  driverDelivery.orderId = this.order.orderId;
  driverDelivery.assignedTime = new Date();

  this.updateOrderStatus(this.order.orderId, 'ASSIGNED');

  this.deliveryService.assignDriver(driverDelivery).subscribe(() => {
    this.closeDriverModal();
  });
}

loadDrivers() {
  this.deliveryService.loadDrivers().subscribe((res: any) => {
    this.drivers = res;
  });
}

getDriverName(id: any){

  let driverFound = this.drivers.find(item=> item.driverId === id);
  let driverName = driverFound?.name;
  return driverName;
}

}



/* *********************************************************************************** */





/*
--------------------------------------------------------------
ORDER | CUSTOMER | AREA | TIME | STATUS | DRIVER | ACTIONS
--------------------------------------------------------------
1023  | Ahmed    | Gulshan | 5m | PREPARING | - | Assign Ready
1024  | Ali      | Clifton | 8m | READY | - | Assign Out
1025  | Bilal    | DHA     | 2m | OUT_FOR_DELIVERY | Imran | Delivered
--------------------------------------------------------------

Optional Filters (Highly Recommended)

Add quick filters above table:

[ All ] [ Preparing ] [ Ready ] [ Out For Delivery ]

*/