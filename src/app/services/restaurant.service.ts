import { Injectable } from '@angular/core';
import { Errors } from '../errors/errors';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, RestaurantTable } from '../model/model-classes.model';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private myUrl = environment.apiUrl  ; 


  constructor(private http:HttpClient) { }
  
  errors: Errors = new Errors();

  getTables() {
    let myUrl = `${this.myUrl}` + `pos/restaurant/getTables`  ;

    return this.http.get<RestaurantTable[]>(myUrl);

  }

  /* ************************************************************* */
  changeTableStatus(restTable: RestaurantTable): Observable<ApiResponse>{
    let myUrl = `${this.myUrl}` + `pos/restaurant/saveTable`  ;
  
    return this.http.post<ApiResponse>(myUrl, restTable).pipe(
      catchError(this.errors.handleError<ApiResponse>('changeTableStatus'))
    );
  
  }
  /* ************************************************************* */
  updateTableStatus(tableId: any, tableStatus:any): Observable<any>{
    let myUrl = `${this.myUrl}` + `pos/restaurant/updateTableStatus/${tableId}/${tableStatus}`  ;
  
    return this.http.get<any>(myUrl).pipe(
      catchError(this.errors.handleError<ApiResponse>('updateTableStatus'))
    );
  
  
  }
  
}
