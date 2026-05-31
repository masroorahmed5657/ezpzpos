import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AppLoggerService } from './app-logger.service';
import { environment } from 'src/environments/environment';
import { Errors } from '../errors/errors'
import { ApiResponse, OrderResponse, Orders, OrderSaveResponse, OrderSearch, Payment } from '../model/model-classes.model';
import Swal from 'sweetalert2';
import { AdjustmentSettlements, SalesAdjustmentItems, SalesAdjustments } from '../data-type';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private myUrl = environment.apiUrl;
  private cloudAPIUrl = environment.cloudAPIUrl;
  private errors: Errors = new Errors();

  constructor(private http: HttpClient) { }
  appLogService: AppLoggerService = new AppLoggerService();

  /* ************************************************************* */
  getDeliveryOrders(orderSearch: OrderSearch): Observable<OrderResponse> {

    let myUrl = `${this.myUrl}` + `orders/findDeliveryOrdersWithItems`;

    return this.http.post<OrderResponse>(myUrl, orderSearch).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<OrderResponse>('findDeliveryOrdersWithItems'))
    );

  }


  /* ************************************************************* */
  getOrders(orderSearch: OrderSearch): Observable<OrderResponse> {

    let myUrl = `${this.myUrl}` + `orders/findOrdersWithItems`;

    return this.http.post<OrderResponse>(myUrl, orderSearch).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<OrderResponse>('saveOrders'))
    );

  }

  /* *********************************************************** */
  createOrder(order: OrderSaveResponse): Observable<OrderSaveResponse> {
    //This will create Orders only

    let myUrl = `${this.myUrl}` + `pos/restaurant/createOrder`;

    return this.http.post<OrderSaveResponse>(myUrl, order).pipe(
      //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<OrderSaveResponse>('createOrder'))
    );

  }




  /* *********************************************************** */
  sentToKitchen(order: OrderSaveResponse): Observable<OrderSaveResponse> {

    //This will save items

    let myUrl = `${this.myUrl}` + `pos/restaurant/sentToKitchen`;

    return this.http.post<OrderSaveResponse>(myUrl, order).pipe(
      //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<OrderSaveResponse>('sentToKitchen'))
    );

  }




  /* ************************************************************* */
  saveOrder(order: OrderSaveResponse): Observable<OrderSaveResponse> {

    let myUrl = `${this.myUrl}` + `orders/save`;

    return this.http.post<OrderSaveResponse>(myUrl, order).pipe(
      //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<OrderSaveResponse>('saveOrder'))
    );

  }

  /* ************************************************************* */
  saveOrdersNoPayment(order: OrderSaveResponse): Observable<OrderSaveResponse> {

    let myUrl = `${this.myUrl}` + `orders/saveOrdersNoPayment`;

    return this.http.post<OrderSaveResponse>(myUrl, order).pipe(
      //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<OrderSaveResponse>('saveOrder'))
    );

  }
  /* ************************************************************* */
  success(message: string) {
    Swal.fire({
      customClass: {
        icon: "alert-success",
      },
      background: "green",
      text: message,
      icon: "success",
      backdrop: false,
      showConfirmButton: false,
      showCloseButton: true,
      allowOutsideClick: true,
      timer: 2000
    });
  }

  // For Error Message
  error(message: any) {
    Swal.fire({
      background: "red",
      icon: "error",
      text: message,
      backdrop: false,
      showConfirmButton: false,
      showCloseButton: true,
      allowOutsideClick: true,
      timer: 2000,
    });
  }

  /* ************************************************************* */
  getTodaysOrders(): Observable<OrderResponse> {

    let myUrl = `${this.myUrl}` + `orders/findTodaysOrdersWithItems`;

    return this.http.get<OrderResponse>(myUrl).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<OrderResponse>('saveOrders'))
    );

  }
  /* ****************************************************************** */
  uploadSales(orders: OrderResponse): Observable<ApiResponse> {

    //check if POS and Admin both are on same server in cloud, then just ignore it.
    if (this.cloudAPIUrl === this.myUrl) {
      let apiResp = new Observable<ApiResponse>();
      return apiResp;
    }
    else {
      let cloudAPI = `${this.cloudAPIUrl}` + `orders/uploadTodaySales`;
      return this.http.post<ApiResponse>(cloudAPI, orders).pipe(
        //tap( error ==> this.log('Save uploadSales') ),
        catchError(this.errors.handleError<ApiResponse>('uploadSales'))
      );

    }


  }
  /* ******************************************************** */
  findBillOfSale(invoiceNbr: any): Observable<OrderResponse> {

    let myUrl = `${this.myUrl}` + `orders/pos/findBillOfSale/${invoiceNbr}`;

    return this.http.get<OrderResponse>(myUrl).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<OrderResponse>('findBillOfSale'))
    );

  }

  /* ************************************************************* */
  getLastBillOfSale(): Observable<OrderResponse> {

    let myUrl = `${this.myUrl}` + `orders/findLastBillOfSale`;

    return this.http.get<OrderResponse>(myUrl).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<OrderResponse>('findLastBillOfSale'))
    );

  }

  /* ************************************************************* */
  getLastMonthBillOfSale(numberOfMonths: number): Observable<OrderResponse> {

    let myUrl = `${this.myUrl}` + `orders/lastMonthBillOfSale/` + numberOfMonths;

    return this.http.get<OrderResponse>(myUrl).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<OrderResponse>('findLastBillOfSale'))
    );

  }
/* ************************************************************* */
cancelSale(orderId:any): Observable<any> {

  let myUrl = `${this.myUrl}` + `orders/cancelSale/${orderId}`;

  return this.http.get<any>(myUrl).pipe(
    //tap( error ==> this.log('Save saveOrders') ),
    catchError(this.errors.handleError<any>('cancelSale'))
  );

}


  /* ************************************************************* */
  getOrdersByTableId(tableId: number): Observable<Orders> {

    let myUrl = `${this.myUrl}` + `orders/pos/findOrderByTableId/${tableId}` ;

    return this.http.get<Orders>(myUrl).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<Orders>('findLastBillOfSale'))
    );

  }
  /* ************************************************************* */
  getOrderItemsByOrderId(orderId: number): Observable<OrderResponse> {

    let myUrl = `${this.myUrl}` + `orders/pos/findOrderItemsByOrderId/${orderId}` ;

    return this.http.get<OrderResponse>(myUrl).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<OrderResponse>('findOrderItemsByOrderId'))
    );

  }


  /* ************************************************************* */
  saveReturn(salesAdj: SalesAdjustments): Observable<SalesAdjustments> {

    let myUrl = `${this.myUrl}` + `salesAdjustment/save`;

    return this.http.post<SalesAdjustments>(myUrl, salesAdj).pipe(
      //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<SalesAdjustments>('saveOrder'))
    );

  }

  /* ************************************************************* */
  saveReturnItems(salesAdjItems: SalesAdjustmentItems[]): Observable<SalesAdjustmentItems[]> {

    let myUrl = `${this.myUrl}` + `salesAdjustmentItem/save`;

    return this.http.post<SalesAdjustmentItems[]>(myUrl, salesAdjItems).pipe(
      //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<SalesAdjustmentItems[]>('saveOrder'))
    );

  }
  /* ******************************************************** */
  findSaleAdjustment(orderId: any): Observable<SalesAdjustments[]> {

    let myUrl = `${this.myUrl}` + `salesAdjustment/findByOrderId/${orderId}`;

    return this.http.get<SalesAdjustments[]>(myUrl).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<SalesAdjustments[]>('findByOrderId'))
    );

  }
  /* ******************************************************** */
  findSaleAdjustmentItemsByAdjustmentId(adjustmentId: any): Observable<SalesAdjustmentItems[]> {

    let myUrl = `${this.myUrl}` + `salesAdjustmentItem/findAll/${adjustmentId}`;

    return this.http.get<SalesAdjustmentItems[]>(myUrl).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<SalesAdjustmentItems[]>('findSaleAdjustmentItemsByAdjustmentId'))
    );

  }
  /* ************************************************************* */
  saveAdjustmentsPayment(salesAdj: AdjustmentSettlements): Observable<AdjustmentSettlements> {

    let myUrl = `${this.myUrl}` + `adjustment/save`;

    return this.http.post<AdjustmentSettlements>(myUrl, salesAdj).pipe(
      //tap( error ==> this.log('Save AdjustmentSettlements') ),
      catchError(this.errors.handleError<AdjustmentSettlements>('saveAdjustmentSettlements'))
    );

  }

  /* ************************************************************* */
  updateOrdersStatus(id: any, targetStatus: any) {
    let myUrl = `${this.myUrl}` + `pos/restaurant/updateOrderStatus/${id}/${targetStatus}`;

    return this.http.get<any>(myUrl).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<any>('updateOrdersStatus'))
    );


  }
  /* ************************************************************* */
  updateOrderItemStatusForOrderId(orderId:any, targetStatus:any): Observable<any> {

    let myUrl = `${this.myUrl}` + `pos/restaurant/updateOrderItemStatusForOrderId/${orderId}/${targetStatus}`;

    return this.http.get<any>(myUrl ).pipe(
      //tap( error ==> this.log('Save updateOrderItemStatus') ),
      catchError(this.errors.handleError<any>('updateOrderItemStatus'))
    );

  }

  /* ************************************************************* */
  updateOrderItemStatus(orderSaveResponse: OrderSaveResponse): Observable<any> {

    let myUrl = `${this.myUrl}` + `pos/restaurant/updateOrderItemStatus`;

    return this.http.post<any>(myUrl, orderSaveResponse).pipe(
      //tap( error ==> this.log('Save updateOrderItemStatus') ),
      catchError(this.errors.handleError<any>('updateOrderItemStatus'))
    );

  }

  /* ************************************************************* */
  updateTableStatus(tableId: any, targetStatus: any) {
    let myUrl = `${this.myUrl}` + `pos/restaurant/updateTableStatus/${tableId}/${targetStatus}`;

    return this.http.get<any>(myUrl).pipe(
      //tap( error ==> this.log('Save updateTableStatus') ),
      catchError(this.errors.handleError<any>('updateTableStatus'))
    );
  }
  /* ************************************************************* */
  savePayment(payment: Payment): Observable<Payment> {

    let myUrl = `${this.myUrl}` + `pos/restaurant/payment`;

    return this.http.post<Payment>(myUrl, payment).pipe(
      //tap( error ==> this.log('Save savePayment') ),
      catchError(this.errors.handleError<Payment>('savePayment'))
    );

  }

    /* ************************************************************* */
  savePaymentOnly(payment: Payment): Observable<Payment> {

    let myUrl = `${this.myUrl}` + `payment/savePaymentOnly`;

    return this.http.post<Payment>(myUrl, payment).pipe(
      //tap( error ==> this.log('Save savePayment') ),
      catchError(this.errors.handleError<Payment>('savePayment'))
    );

  }

}
