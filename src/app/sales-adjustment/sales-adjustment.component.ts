import { AdjustmentSettlements, AdjustmentType, ItemType, SalesAdjustmentItems, SalesAdjustments } from '../data-type';
import { environment } from 'src/environments/environment';
import { faCartPlus, faSignOut, faPrint, faList, faCloudUpload, faCloudDownload, faPerson, faCreditCard, faCashRegister, faPlusSquare, faDashboard, faRemove, faRupeeSign, faDollar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {
  AdminUser,
  ApiResponse,
  BarcodeResponse,
  CartHold,
  Category,
  CodeMaster,
  Customer,
  CustomerRequest,
  DbUpdate,
  Departments,
  OrderItemProductWrapper,
  OrderResponse,
  OrderSaveResponse,
  OrderSearch,
  Orders,
  OrdersCustomerPaymentWrapper,
  OrdersCustomerWrapper,
  OrdersItems,
  Payment,
  PriceSummary,
  Product,
  ProductAttributes,
  ProductView,
  ProductWrapper,
} from '../model/model-classes.model';
import { CacheService } from '../services/cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { PaymentService } from '../services/payment.service';
import { CustomerService } from '../services/customer.service';
import { OrdersService } from '../services/orders.service';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { forkJoin, lastValueFrom, Observable, tap } from 'rxjs';
import { PrintService } from '../services/print.service';




@Component({
  selector: 'app-sales-adjustment',
  templateUrl: './sales-adjustment.component.html',
  styleUrls: ['./sales-adjustment.component.scss']
})
export class SalesAdjustmentComponent implements OnInit {

  order: Orders = new Orders();
  orderItemList: OrderItemProductWrapper[] = [];
  customer: Customer = new Customer();

  showSalesAdjItemFlag = false;
  highlightedUpc: string | null = null;
  thermalTag = false;
  returnAmount: any;
  issueAmount: any;
  netAmount: any;
  items: any[] = [];
  salesAdj: SalesAdjustments = new SalesAdjustments();
  salesAdjItems: SalesAdjustmentItems[] = [];
  salesAdjPrevious: SalesAdjustments[] = [];
  salesAdjItemsPrevious: SalesAdjustmentItems[] = [];
  adjustmentSettlement: AdjustmentSettlements = new AdjustmentSettlements();
  paymentMethod: string[] = ['CASH', 'CARD'];
  paymentMethodSelected = 'CASH';

  product: any;
  barcodeInput: any;
  settlementStatus: any;
  InvoiceNbr = '';
  logoName = environment.logoName;
  faSignOut = faSignOut;
  faCartPlus = faCartPlus;
  faEdit = faEdit;
  isLoggedIn = false;
  posUrl = '/' + environment.posUrl;
  branchName = environment.branchName;
  currencyName = environment.currency;
  currency = environment.currency;
  showTaxFlag = environment.showTaxFlag;
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
    private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService,
    private productService: ProductService,
    private orderService: OrdersService,
    private customerService: CustomerService,
    private userService: UserService,
    private paymentService: PaymentService,
    private printService: PrintService



  ) { }

  ngOnInit() {

    window.scrollTo(0, 0);
    let reload = this.cache.get('reload');
    if (reload === null || reload === undefined) {
      this.cache.set('reload', 'T');
      window.location.reload();
    } else if (reload === 'F') {
      this.cache.set('reload', 'T');
      window.location.reload();
    } else if (reload === 'T') {
      let t1 = 1;
      //reload happned from same screen by calling window.location.reload()
    }



    this.InvoiceNbr = sessionStorage.getItem('invoiceNbr') || '';
    this.order = JSON.parse(sessionStorage.getItem('order') || '{}');
    this.orderItemList = JSON.parse(sessionStorage.getItem('orderItemsList') || '[]');
    this.salesAdj = JSON.parse(sessionStorage.getItem('salesAdj') || '{}');
    this.salesAdjItems = JSON.parse(sessionStorage.getItem('salesAdjItems') || '[]');
    this.salesAdjItemsPrevious = JSON.parse(sessionStorage.getItem('salesAdjItemsPrevious') || '[]');

  }
  /* ************************************************************** */
  clearPage() {
    this.InvoiceNbr = sessionStorage.getItem('invoiceNbr') || '';
    this.order = JSON.parse(sessionStorage.getItem('order') || '{}');
    this.orderItemList = JSON.parse(sessionStorage.getItem('orderItemsList') || '[]');
    this.salesAdj = JSON.parse(sessionStorage.getItem('salesAdj') || '{}');
    this.salesAdjItems = JSON.parse(sessionStorage.getItem('salesAdjItems') || '[]');
    this.salesAdjItemsPrevious = JSON.parse(sessionStorage.getItem('salesAdjItemsPrevious') || '[]');
  }


  /* ************************************************************ */



  proceedSettlement() {
    this.showSalesAdjItemFlag = true;

    this.salesAdj.adjustmentDate = new Date();
    this.salesAdj.createdDate = new Date();

    if (this.order.orderId === undefined || this.order.orderId === null) {
      Swal.fire('Error', 'Order ID is missing. Please check invoice number', 'error');
      return;
    }
    this.salesAdj.orderId = this.order.orderId;

    this.adjustmentSettlement.adjustmentId = this.salesAdj.adjustmentId;
    this.adjustmentSettlement.amount = this.salesAdj.returnAmount;
    this.adjustmentSettlement.settlementDate = this.salesAdj.adjustmentDate;
    this.adjustmentSettlement.settlementMethod = this.paymentMethodSelected;



    //saving to DB
    this.orderService.saveReturn(this.salesAdj).subscribe(data => {
      if (data != undefined) {
        let orderId = data.orderId;
        let adjustmentId = data.adjustmentId;
        if (adjustmentId) {
          //Now save Adjustment Items.
          this.salesAdjItems.forEach(element => {
            element.adjustmentId = adjustmentId;
          });
          this.orderService.saveReturnItems(this.salesAdjItems).subscribe((data1: SalesAdjustmentItems[]) => {
            if (data1) {
              this.adjustmentSettlement.adjustmentId = adjustmentId;
              this.orderService.saveAdjustmentsPayment(this.adjustmentSettlement).subscribe((data2: AdjustmentSettlements) => {
                if (data2) {
                  Swal.fire('Success', 'Return saved successfully', 'success');

                  //printThermal(customer: Customer, payment: Payment, cartDataList: CartHold, customerBalance: number, invoiceNumber:any)
                  let payment: Payment = new Payment();
                  payment.paymentMethod = this.paymentMethodSelected;
                  this.cache.set('reload', 'F');
                  this.printService.printReturnSlipThermal(this.customer, payment, this.salesAdjItems, this.netAmount, this.InvoiceNbr);


                  this.clearCart();
                  window.location.reload();
                }
              });


            }
          });

        }
      }
    }
    );


  }
  /* ************************************************************ */
  onItemsChange(event: any) {

  }

  /* ********************************************************* */
  @ViewChildren('row') rows!: QueryList<ElementRef>;

  scrollToHighlighted() {
    setTimeout(() => {
      const index = this.orderItemList.findIndex(
        i => i.products?.upc === this.highlightedUpc
      );

      if (index >= 0) {
        this.rows.get(index)?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  }
  /* ******************************************************** */
  checkIfItemReturn(foundIndex: any): boolean {
    let bRet = false;
    const foundItem = this.orderItemList[foundIndex];
    const productId = foundItem.products?.productId;
    const foundPrevReturn = this.salesAdjItemsPrevious.find(item => item.productId === productId);
    let totalQtyReturned = 0;

    this.salesAdjItemsPrevious.forEach(items => {
      if (items.productId === productId) {
        totalQtyReturned += items.qty;
      }

    });

    let oldSaleQty = foundItem.ordersItems?.quantity;
    //If Qty Returned already reached old Sale Qty, now customer can't return, as all item purchased has been returned already
    if (totalQtyReturned >= oldSaleQty!) {
      bRet = true;
    }
    else {
      bRet = false;
    }


    return bRet;
  }



  /* ******************************************************** */
  upcSearch(barcode: string) {
    if (!barcode) return;

    const foundItem = this.orderItemList.find(item => item.products?.upc == barcode);
    const foundIndex = this.orderItemList.findIndex(item => item.products?.upc == barcode);

    if (foundItem) {
      this.highlightedUpc = foundItem.products?.upc || null;
      this.scrollToHighlighted();

      //Check if item has been returned already?
      if (this.checkIfItemReturn(foundIndex)) {
        Swal.fire('FULL RETURNED', 'All items have been returned already', 'warning');
        const barcodeInput = <HTMLInputElement>document.getElementById('barcodeInput');
        barcodeInput.value = '';

        //Swal.fire({ title: 'FULL RETURNED', timer: 7000, text: `All items have been returned already`, icon: 'warning' });

      }
      else {

        this.returnItem(foundIndex);
      }


    }
    else {
      Swal.fire('NOT FOUND', 'Item does not exist in Bill', 'warning');
    }

    // // clear input for next scan
    // if (this.barcodeInput !== undefined) {
    //   this.barcodeInput.value = '';
    //   const barcodeInput = <HTMLInputElement>document.getElementById('barcodeInput');
    //   barcodeInput.value='';
    // }
    let i = 0;

  }

  /* ************************************************************* */

  calculateTotals() {
    let returnAmount = 0;
    let issueAmount = 0;

    this.salesAdjItems.forEach((item: { totalAmount: number; qty: number; unitPrice: number; itemType: string; }) => {
      item.totalAmount = item.qty * item.unitPrice;

      if (item.itemType === 'RETURN') {
        returnAmount += item.totalAmount;
      } else {
        issueAmount += item.totalAmount;
      }
    });

    this.returnAmount = returnAmount;
    this.salesAdj.returnAmount = returnAmount;
    this.issueAmount = issueAmount;
    this.netAmount = issueAmount - returnAmount;

    if (this.netAmount === 0) {
      this.settlementStatus = 'EVEN';
    } else if (this.netAmount > 0) {
      this.settlementStatus = 'CUSTOMER_PAY';
    } else {
      this.settlementStatus = 'STORE_PAY';
    }

    this.salesAdj.settlementStatus = this.settlementStatus;
    sessionStorage.setItem('salesAdjItems', JSON.stringify(this.salesAdjItems));

  }
  /* ************************************************************ */

  printReceipt() {
    window.print();
  }

  /* ************************************************************** */
  signOut() {
    this.cache.set('currentUser', null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.clearCart();

    sessionStorage.clear();

    this.cache.resetAllData();

    this.isLoggedIn = false;
    if (this.isLoggedIn) {
      //this.loginService.logOutUser();
      //this.serverLogout();
    }
    this.router.navigate(['login']);
  }

  /* ****************************************************************** */
  clearCart() {
    sessionStorage.setItem('invoiceNbr', '');
    sessionStorage.setItem('order', '');
    sessionStorage.setItem('orderItemsList', '');
    sessionStorage.setItem('salesAdj', '');
    sessionStorage.setItem('salesAdjItems', '');
    sessionStorage.setItem('salesAdjItemsPrevious', '');

  }
  /* **************************************************************** */
  initSetupAfterLoad(): Observable<any> {


    this.priceCalculationTotal();

    this.salesAdj.adjustmentDate = new Date();
    let currentUser: any = sessionStorage.getItem('currentUser');
    let customer: Customer = JSON.parse(currentUser);

    this.salesAdj.createdBy = customer.loginId;
    this.salesAdj.createdDate = new Date();
    this.salesAdj.adjustmentDate = new Date();
    this.salesAdj.adjustmentType = AdjustmentType.RETURN;
    this.salesAdj.orderId = this.order.orderId;

    sessionStorage.setItem('invoiceNbr', this.InvoiceNbr);
    sessionStorage.setItem('order', JSON.stringify(this.order));
    sessionStorage.setItem('orderItemsList', JSON.stringify(this.orderItemList));
    sessionStorage.setItem('salesAdj', JSON.stringify(this.salesAdj));
    sessionStorage.setItem('salesAdjItemsPrevious', JSON.stringify(this.salesAdjItemsPrevious));

    return new Observable<any>;

  }
  /* ************************************************************** */
  async loadInvoice(): Promise<void> {
    try {

      await lastValueFrom(
        forkJoin([
          this.loadBOS(),

        ])

      );


      // this.initSetupAfterLoad();



      //await this.loadBOS();     // waits for completion
      //await this.loadPreAdjustments();     // waits for completion

      // runs only after both are done
      // or: await method3(); if it also returns Promise
    } catch (err) {
      console.error('Something failed:', err);
      // handle error (show toast, etc.)
    }
  }


  /* **************************************************************** */
  invoiceSearch(event: any) {
    if (event.key === 'Enter') {
      //check value
      if (this.InvoiceNbr === '') {
        return;
      }
      else if (this.orderItemList.length > 0) {

        Swal.fire({
          title: 'Cancel Return',
          text: 'Are you sure to Cancel Return?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Cancel it!',
          cancelButtonText: 'No, keep it'
        }).then((response: any) => {

          if (response.value) {

            this.clearCart();
            window.location.reload();
          }

        });



        // return;
      }
      this.loadInvoice();
    }

  }
  /* **************************************************************** */
  loadBOS(): Observable<OrderResponse> {

    return this.orderService.findBillOfSale(this.InvoiceNbr).pipe(
      tap((data: OrderResponse) => {
        if (data !== undefined) {
          if (data.orderCustomer === null) {
            Swal.fire('NOT FOUND', 'Invoice does not exist', 'error');
            return;
          }
          this.customer = data.orderCustomer[0]?.customer!;
          this.order = data.orderCustomer[0]?.orders!;
          this.orderItemList = data.orderItems;

          this.salesAdj.adjustmentDate = new Date();
          let currentUser: any = sessionStorage.getItem('currentUser');
          let customer: Customer = JSON.parse(currentUser);

          this.salesAdj.createdBy = customer.loginId;
          this.salesAdj.createdDate = new Date();
          this.salesAdj.adjustmentDate = new Date();
          this.salesAdj.adjustmentType = AdjustmentType.RETURN;
          this.salesAdj.orderId = this.order.orderId;

          sessionStorage.setItem('invoiceNbr', this.InvoiceNbr);
          sessionStorage.setItem('order', JSON.stringify(this.order));
          sessionStorage.setItem('orderItemsList', JSON.stringify(this.orderItemList));
          sessionStorage.setItem('salesAdj', JSON.stringify(this.salesAdj));


          //Check if we already have Return account for this Invoice
          this.loadPreAdjustments();

        }
        else {
          Swal.fire('NOT FOUND', 'Invoice does not exist', 'error');
          return;
        }
      }));


  }


  /* **************************************************************** */
  loadPreAdjustments() {
    this.orderService.findSaleAdjustment(this.order.orderId).subscribe((data: SalesAdjustments[]) => {
      if (data) {
        this.salesAdjPrevious = data;
        if (this.salesAdjPrevious.length > 0) {
          this.salesAdjPrevious.forEach(items => {
            let adjId = items.adjustmentId;
            return this.orderService.findSaleAdjustmentItemsByAdjustmentId(adjId).subscribe(((data1: SalesAdjustmentItems[]) => {
              if (data1) {
                this.salesAdjItemsPrevious = this.salesAdjItemsPrevious.concat(data1);
                sessionStorage.setItem('salesAdjItemsPrevious', JSON.stringify(this.salesAdjItemsPrevious));
              }

            }));
          })
        }
      }

    });


  }



  /* ************************************************************************************************** */

  getPrice(product: any): any {
    let price = 0;
    if (product.upc === '00448666') {
      price = product.price;
    }
    else {
      price = (product.salePrice
        ? product.salePrice
        : product.unitPrice);

    }

    return price;
  }

  /* ************************************************************** */
  priceCalculationTotal(): void {

    this.priceSummary.tax = 0;
    this.priceSummary.total = 0;
    this.priceSummary.discount = 0;
    this.priceSummary.grandTotal = 0;
    this.priceSummary.totalQty = 0;
    this.priceSummary.totalWithoutDiscount = 0;

    if (this.orderItemList.length === 0) return;

    let finalPrice = 0;
    //let row = -1;

    //if (this.showTaxFlag) 
    {

      for (let row = 0; row < this.orderItemList.length; row++) {
        let totalTax = 0, totalDiscount = 0, total = 0, grandTotal = 0, totalQty = 0, totalPrice = 0;


        totalTax = Number(this.orderItemList[row].products?.tax);
        this.priceSummary.tax += Number(totalTax);


        totalDiscount = Number(this.orderItemList[row].products?.discount);
        this.priceSummary.discount += Number(totalDiscount);



        totalQty = Number(this.orderItemList[row].ordersItems?.quantity);
        this.priceSummary.totalQty += Number(totalQty);

        total = Number(this.orderItemList[row].products?.salePrice * totalQty) - totalDiscount;
        this.priceSummary.total += Number(total);

        totalPrice = Number(this.orderItemList[row].products?.salePrice);
        this.priceSummary.totalWithoutDiscount += totalPrice;


        this.priceSummary.grandTotal += Number(this.orderItemList[row].products?.salePrice);


      }//for loop


    }
    // else {
    //   for (let row = 0; row < this.cartDataList.product.length; row++) {
    //     let totalTax = 0, totalDiscount = 0, total = 0, grandTotal = 0, totalQty = 0, totalPrice = 0;

    //     if (this.cartDataList.product[row].discountVal === undefined) {
    //       this.cartDataList.product[row].discountVal = 0;
    //     }

    //     totalDiscount = Number(this.cartDataList.product[row].discountVal);
    //     this.priceSummary.discount += Number(totalDiscount);
    //     let qty = Number(this.cartDataList.product[row].quantity);
    //     totalQty = qty;
    //     this.priceSummary.totalQty += Number(totalQty);
    //     total = Number(this.cartDataList.product[row].totalPrice);
    //     this.priceSummary.total += Number(total);

    //     totalPrice = Number(this.cartDataList.product[row].price);
    //     this.priceSummary.totalWithoutDiscount += totalPrice;


    //     this.priceSummary.grandTotal += Number(this.cartDataList.product[row].totalPrice);


    //   }//for loop


    // }

    this.priceSummary.grandTotal = Number(((Number(this.priceSummary.grandTotal))).toFixed(3));// Number(Math.round((Number(this.priceSummary.grandTotal))).toFixed(3));


  }

  removeItem(row: any) {
    this.salesAdjItems.splice(row, 1);
  }

  addItem() {

  }

  recalculate(returnItem: SalesAdjustmentItems) {
    let qtyReturtn = returnItem.qty;
    const productId = returnItem.productId;
    if (qtyReturtn === undefined || qtyReturtn === null) return;
    let productReturn = this.orderItemList.find(item => item.products?.productId == productId);

    if (productReturn) {
      if (qtyReturtn > productReturn?.ordersItems?.quantity!) {
        Swal.fire('Quantity', 'Quantity can not be more than the actual Sale', 'error');
        returnItem.qty = 0;
        this.calculateTotals();
        return;
      }
      else {
        this.calculateTotals();
      }

    }


  }

  returnItem(row: any) {
    this.showSalesAdjItemFlag = true;
    //First check if this item already in return list
    let productReturn = this.salesAdjItems.find(item => item.productId == this.orderItemList[row].products?.productId);

    if (productReturn) {
      //Don't do anything as this item already in Return list
      return;
    }
    else {
      let salesAdjItem = new SalesAdjustmentItems();
      salesAdjItem.productId = this.orderItemList[row].products?.productId;
      salesAdjItem.productName = this.orderItemList[row].products?.productName;
      salesAdjItem.upc = this.orderItemList[row].products?.upc;
      salesAdjItem.unitPrice = this.orderItemList[row].products?.salePrice;


      salesAdjItem.itemType = ItemType.RETURN;

      this.salesAdjItems.push(salesAdjItem);

    }


  }
  // /* ********************************************** */
  // gotoPos() {

  //   if (this.orderItemList.length > 0) {

  //     Swal.fire({
  //       title: 'Cancel Return',
  //       text: 'Are you sure to Cancel Return?',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes, Cancel it!',
  //       cancelButtonText: 'No, keep it'
  //     }).then((response: any) => {

  //       if (response.value) {

  //         this.clearCart();
  //         this.router.navigate([this.posUrl]);
  //       }

  //     });
  //   }
  //   else {
  //     this.clearCart();
  //     this.router.navigate([this.posUrl]);

  //   }


  // }
  /* ********************************************** */
  gotoPos() {

    
      this.router.navigate([this.posUrl]);

    


  }


}
