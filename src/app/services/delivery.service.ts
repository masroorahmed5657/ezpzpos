import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AppLoggerService } from './app-logger.service';
import { environment } from 'src/environments/environment';
import { Errors } from '../errors/errors'
import { DriverDelivery, Drivers } from '../data-type';
import { OrderSaveResponse } from '../model/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private myUrl = environment.apiUrl;
  private cloudAPIUrl = environment.cloudAPIUrl;
  private errors: Errors = new Errors();

  constructor(private http: HttpClient) { }
  appLogService: AppLoggerService = new AppLoggerService();

    /* ******************************************************** */
    loadDrivers(): Observable<Drivers[]> {
  
      let myUrl = `${this.myUrl}` + `delivery/drivers/getDrivers`;
  
      return this.http.get<Drivers[]>(myUrl).pipe(
        catchError(this.errors.handleError<Drivers[]>('loadDrivers'))
      );
  
    }
  /* ******************************************************** */
    assignDriver(order: DriverDelivery): Observable<DriverDelivery> {
      //This will create Orders only
  
      let myUrl = `${this.myUrl}` + `delivery/driverAssign`;
  
      return this.http.post<DriverDelivery>(myUrl, order).pipe(
        //tap( error ==> this.log('Save orders') ),
        catchError(this.errors.handleError<DriverDelivery>('createOrder'))
      );
  
    }
  

}
