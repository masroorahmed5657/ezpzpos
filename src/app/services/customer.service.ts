import { Injectable } from '@angular/core';
import { Customer, CustomerType, Address, Category, Country, CountryStateProvince, CustomerRequest, CustomerResponse } from '../model/model-classes.model';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AppLoggerService } from './app-logger.service';
import { environment } from 'src/environments/environment';
import { Errors } from '../errors/errors'


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private url = environment.apiUrl ; //http://localhost:9080/EZPZ_WS/customer
  private errors: Errors = new Errors();

  constructor(private http: HttpClient,
              private appLogService: AppLoggerService) { }


  saveCustomer(customer: CustomerRequest): Observable<CustomerResponse>{

    let myUrl = `${this.url}` + `customer/save`  ;
    
    return this.http.post<CustomerResponse>(myUrl, customer).pipe(
        //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<CustomerResponse>('saveCustomer'))
    );
  
  }
  /* ****************************************************************** */
  updateCustomer(customer: CustomerRequest): Observable<number>{

    let myUrl = `${this.url}` + `customer/update`  ;
    
    return this.http.put<number>(myUrl, customer).pipe(
        //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<number>('saveCustomer'))
    );
  
  }
  /* ****************************************************************** */
  saveAddress(address: Address): Observable<Address>{

    let myUrl = `${this.url}` + `address/save`  ;
    
    return this.http.post<Address>(myUrl, address).pipe(
        //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<Address>('saveAddress'))
    );
  
  }

  /* ****************************************************************** */
  getCustomerTypeList(): Observable<CustomerType[]>{

    let myUrl = `${this.url}` + `customerTypes/findAllCustomerType/`  ;
  
  
    return this.http.get<CustomerType[]>(myUrl).pipe(
        //tap( error ==> this.log('Fetched orders') ),
      catchError(this.errors.handleError<CustomerType[]>('getCustomerTypeList'))
    );
  }
  /* ****************************************************************** */
  getCategoryList(): Observable<Category[]>{

    let myUrl = `${this.url}` + `category/findAllCategories/`  ;
  
  
    return this.http.get<Category[]>(myUrl).pipe(
        //tap( error ==> this.log('Fetched orders') ),
      catchError(this.errors.handleError<Category[]>('getCategoryList'))
    );
  }
  /* ********************************************************************** */
  getCountryList(): Observable<Country[]>{

    let myUrl = `${this.url}` + `country/findAll/`  ;
  
  
    return this.http.get<Country[]>(myUrl).pipe(
        //tap( error ==> this.log('Fetched Countries') ),
      catchError(this.errors.handleError<Country[]>('getCountryList'))
    );
  }
  /* ********************************************************************** */
  getProvinceCityList(): Observable<CountryStateProvince[]>{

    let myUrl = `${this.url}` + `countryStateProvince/findAll/`  ;
  
  
    return this.http.get<CountryStateProvince[]>(myUrl).pipe(
        //tap( error ==> this.log('Fetched Countries') ),
      catchError(this.errors.handleError<CountryStateProvince[]>('getProvinceCityList'))
    );
  }
  /* ********************************************************************** */
  getAPI(): Observable<any>{

    let myUrl = `https://www.universal-tutorial.com/api/getaccesstoken`  ;
  
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('api-token', 'G6IQ20qqCQxpoEBXZz4bawPYcujL47gdZlMpiCjMpaAXvpBqAFXzIpOoMERBDafXMjs')
    .set('user-email', 'info@techmaci.com');

    return  this.http.get<string>(myUrl, {headers}).pipe(
        //tap( error ==> this.log('Fetched Countries') ),
      catchError(this.errors.handleError<string>('getAPI'))
    );

  }

  getAPIFree(): Observable<any>{

    let myUrl = `https://www.pwrc.usgs.gov/bbl/manual/country_codes.cfm`  ;
  
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
    
    

    return this.http.get<string>(myUrl, {headers}).pipe(
        //tap( error ==> this.log('Fetched Countries') ),
      catchError(this.errors.handleError<string>('getAPI'))
    );

  }

  getAPICountries(): Observable<any>{

    let myUrl = `https://www.universal-tutorial.com/api/countries/`  ;
  
    const headers= new HttpHeaders()
    .set('Accept', 'application/json')  
    .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7I…zI0fQ.oK4sdkwZYMiU4J0wlpxHstNIidV28L6y3R7XPUymA9M');
    

    return  this.http.get<string>(myUrl, {headers}).pipe(
        //tap( error ==> this.log('Fetched Countries') ),
      catchError(this.errors.handleError<string>('getAPI'))
    );

  }


}
