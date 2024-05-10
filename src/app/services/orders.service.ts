import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AppLoggerService } from './app-logger.service';
import { environment } from 'src/environments/environment';
import { Errors } from '../errors/errors'
import { OrderResponse, Orders, OrderSaveResponse, OrderSearch } from '../model/model-classes.model';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private myUrl = environment.apiUrl  ; //http://localhost:9080/PAG_WS/
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



}
