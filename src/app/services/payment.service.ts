import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//import {  ProductWrapper, product } from '../data-type';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';
import { AlertMessage, Payment, ApiResponse, OrdersCustomerPaymentWrapper } from '../model/model-classes.model';
import { Errors } from '../errors/errors';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private myUrl = environment.apiUrl  ; 
  private cloudApiUrl = environment.cloudAPIUrl;

  constructor(private http:HttpClient) { }

  errors: Errors = new Errors();



  /* ************************************************************* */
savePayment(payment: Payment): Observable<ApiResponse>{
  let myUrl = `${this.myUrl}` + `payment/pos/save`  ;

  return this.http.post<ApiResponse>(myUrl, payment).pipe(
    catchError(this.errors.handleError<ApiResponse>('getProducts'))
  );


}
/* ************************************************************* */

getPartialPaymentByBOS(billOfSale: string): Observable<OrdersCustomerPaymentWrapper>{

  let retFlag=true;
  if (billOfSale===undefined) retFlag=false;
  if (billOfSale.length===0) retFlag=false;

  if (retFlag){
    let myUrl = `${this.myUrl}` + `payment/pos/findPaymentByBillOfSale/` + billOfSale ;

    return this.http.get<OrdersCustomerPaymentWrapper>(myUrl).pipe(
        
      catchError(this.errors.handleError<OrdersCustomerPaymentWrapper>('getProducts'))
    );
  
  }
  else{
    return new Observable();
  }

}

/* ************************************************************* */

getPartialPaymentByCustPhone(phone1: string): Observable<OrdersCustomerPaymentWrapper[]>{

  let retFlag=true;
  if (phone1===undefined) retFlag=false;
  if (phone1.length===0) retFlag=false;

  if (retFlag){
    let myUrl = `${this.myUrl}` + `payment/pos/findPaymentByCustPhone/` + phone1 ;

    return this.http.get<OrdersCustomerPaymentWrapper[]>(myUrl).pipe(
        
      catchError(this.errors.handleError<OrdersCustomerPaymentWrapper[]>('getProducts'))
    );
  
  }
  else{
    return new Observable();
  }

}


}
