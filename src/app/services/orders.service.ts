import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AppLoggerService } from './app-logger.service';
import { environment } from 'src/environments/environment';
import { Errors } from '../errors/errors'
import { ApiResponse, OrderResponse, Orders, OrderSaveResponse, OrderSearch } from '../model/model-classes.model';
import Swal from 'sweetalert2';
import { AdjustmentSettlements, SalesAdjustmentItems, SalesAdjustments } from '../data-type';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private myUrl = environment.apiUrl  ; 
  private cloudAPIUrl = environment.cloudAPIUrl;
  private errors: Errors = new Errors();

  constructor(private http: HttpClient ) { }
  appLogService: AppLoggerService = new AppLoggerService() ;

/* ************************************************************* */
  getOrders(orderSearch: OrderSearch): Observable<OrderResponse>{

    let myUrl = `${this.myUrl}` + `orders/findOrdersWithItems` ;

    return this.http.post<OrderResponse>(myUrl, orderSearch).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
    catchError(this.errors.handleError<OrderResponse>('saveOrders'))
  );

  }


/* ************************************************************* */
  saveOrder(order: OrderSaveResponse): Observable<OrderSaveResponse>{

    let myUrl = `${this.myUrl}` + `orders/save`  ;

    return this.http.post<OrderSaveResponse>(myUrl, order).pipe(
        //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<OrderSaveResponse>('saveOrder'))
    );

  }


  success(message: string) {
    Swal.fire({
      customClass: {
        icon: "alert-success",
      },
      background: "green",
      text:message,
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
  getTodaysOrders(): Observable<OrderResponse>{

    let myUrl = `${this.myUrl}` + `orders/findTodaysOrdersWithItems` ;

    return this.http.get<OrderResponse>(myUrl ).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
      catchError(this.errors.handleError<OrderResponse>('saveOrders'))
    );

  }
/* ****************************************************************** */
  uploadSales(orders: OrderResponse): Observable<ApiResponse>{

    //check if POS and Admin both are on same server in cloud, then just ignore it.
    if (this.cloudAPIUrl === this.myUrl){
      let apiResp = new Observable<ApiResponse>();
      return apiResp;
    }
    else{
      let cloudAPI = `${this.cloudAPIUrl}` + `orders/uploadTodaySales`;
      return this.http.post<ApiResponse>(cloudAPI, orders ).pipe(
        //tap( error ==> this.log('Save uploadSales') ),
        catchError(this.errors.handleError<ApiResponse>('uploadSales'))
      );
  
    }


  }
/* ******************************************************** */
findBillOfSale(invoiceNbr:any): Observable<OrderResponse>{

  let myUrl = `${this.myUrl}` + `orders/pos/findBillOfSale/${invoiceNbr}`  ;

  return this.http.get<OrderResponse>(myUrl ).pipe(
    //tap( error ==> this.log('Save saveOrders') ),
    catchError(this.errors.handleError<OrderResponse>('findBillOfSale'))
  );

}

/* ************************************************************* */
getLastBillOfSale(): Observable<OrderResponse>{

  let myUrl = `${this.myUrl}` + `orders/findLastBillOfSale` ;

  return this.http.get<OrderResponse>(myUrl ).pipe(
    //tap( error ==> this.log('Save saveOrders') ),
    catchError(this.errors.handleError<OrderResponse>('findLastBillOfSale'))
  );

}

/* ************************************************************* */
getLastMonthBillOfSale(numberOfMonths:number): Observable<OrderResponse>{

  let myUrl = `${this.myUrl}` + `orders/lastMonthBillOfSale/` + numberOfMonths;

  return this.http.get<OrderResponse>(myUrl ).pipe(
    //tap( error ==> this.log('Save saveOrders') ),
    catchError(this.errors.handleError<OrderResponse>('findLastBillOfSale'))
  );

}
/* ************************************************************* */
  saveReturn(salesAdj: SalesAdjustments): Observable<SalesAdjustments>{

    let myUrl = `${this.myUrl}` + `salesAdjustment/save`  ;

    return this.http.post<SalesAdjustments>(myUrl, salesAdj).pipe(
        //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<SalesAdjustments>('saveOrder'))
    );

  }

/* ************************************************************* */
  saveReturnItems(salesAdjItems: SalesAdjustmentItems[]): Observable<SalesAdjustmentItems[]>{

    let myUrl = `${this.myUrl}` + `salesAdjustmentItem/save`  ;

    return this.http.post<SalesAdjustmentItems[]>(myUrl, salesAdjItems).pipe(
        //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<SalesAdjustmentItems[]>('saveOrder'))
    );

  }
/* ******************************************************** */
findSaleAdjustment(orderId:any): Observable<SalesAdjustments[]>{

  let myUrl = `${this.myUrl}` + `salesAdjustment/findByOrderId/${orderId}`  ;

  return this.http.get<SalesAdjustments[]>(myUrl ).pipe(
    //tap( error ==> this.log('Save saveOrders') ),
    catchError(this.errors.handleError<SalesAdjustments[]>('findByOrderId'))
  );

}
/* ******************************************************** */
findSaleAdjustmentItemsByAdjustmentId(adjustmentId:any): Observable<SalesAdjustmentItems[]>{

  let myUrl = `${this.myUrl}` + `salesAdjustmentItem/findAll/${adjustmentId}`  ;

  return this.http.get<SalesAdjustmentItems[]>(myUrl ).pipe(
    //tap( error ==> this.log('Save saveOrders') ),
    catchError(this.errors.handleError<SalesAdjustmentItems[]>('findSaleAdjustmentItemsByAdjustmentId'))
  );

}
/* ************************************************************* */
saveAdjustmentsPayment(salesAdj: AdjustmentSettlements): Observable<AdjustmentSettlements>{

    let myUrl = `${this.myUrl}` + `adjustment/save`  ;

    return this.http.post<AdjustmentSettlements>(myUrl, salesAdj).pipe(
        //tap( error ==> this.log('Save AdjustmentSettlements') ),
      catchError(this.errors.handleError<AdjustmentSettlements>('saveAdjustmentSettlements'))
    );

  }


}
