import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//import {  ProductWrapper, product } from '../data-type';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';
import { AlertMessage, Payment, ApiResponse } from '../model/model-classes.model';
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

}
