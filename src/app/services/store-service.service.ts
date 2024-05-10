import { Injectable } from '@angular/core';
import { Errors } from '../errors/errors';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';
import { StoreHours } from '../model/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class StoreServiceService {

  private myUrl = environment.apiUrl ; //http://localhost:8080/FOODY_API/
  errors: Errors = new Errors();

  constructor(private http:HttpClient) { }


saveStoreHour(storeHour: StoreHours): Observable<StoreHours>{

  let myUrl = `${this.myUrl}` + `storeHours/save`  ;

  return this.http.post<StoreHours>(myUrl, storeHour).pipe(
      // tap( Errors ==> this.log('Save Supplier') ),
    catchError(this.errors.handleError<StoreHours>('saveStoreHour'))
);

}
/* ********************* */
getStoreHoursList(): Observable<StoreHours[]>{

  let myUrl = `${this.myUrl}` + `storeHours/findAllStoreHours` ;

  return this.http.get<StoreHours[]>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Brands') ),
    catchError(this.errors.handleError<StoreHours[]>('getbrndList'))
);
}

/* ********************* */
}
