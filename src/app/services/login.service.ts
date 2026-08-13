import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpContext, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
//import { HttpMethodService } from '../helper/http-method.service';

import { Errors } from '../errors/errors'

import { AdminUser, ApiResponse, CashierShift, DeviceRegister, TokenNumber, UserLoginResponse } from '../model/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userSubject: BehaviorSubject<AdminUser | null>;
  public user: Observable<AdminUser | null>;
  private url = environment.apiUrl + 'login'; //http://localhost:9080/FASHION_API/login
  private errors: Errors = new Errors();

  constructor(
    private router: Router,
    //private http2: HttpMethodService,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }
/* ********************************************************************************************** */
  login(loginId: any, loginPassword: any) {
    return this.http.post<AdminUser>(`${environment.apiUrl}/users/authenticate`, { loginId, loginPassword })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }
/* ********************************************************************************************** */
  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
/* ********************************************************************************************** */
  register(user: AdminUser) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }
/* ********************************************************************************************** */
  registerUser(adminUser: AdminUser): Observable<AdminUser> {
    
    let myUrl = environment.apiUrl + `register`;


    return this.http.post<AdminUser>(myUrl, adminUser).pipe(
      //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<AdminUser>('saveRegister'))
    );

  }
/* ********************************************************************************************** */
  signinUser(adminUser: AdminUser): Observable<UserLoginResponse> {

    let myUrl = `${this.url}` + `signin`;

    return this.http.post<UserLoginResponse>(myUrl, adminUser).pipe(

      //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<UserLoginResponse>('signinUser'))
    );

  }

  /* ********************************************************************************************** */
  

  // Provide username and password for authentication, and once authentication is successful,
  //store JWT token in session
  authenticate(username: string, password: any):any  {

    let endpoint = environment.apiUrl + `authenticate`;
    
    const headers = new HttpHeaders()
    .set('X-DB', username)
    .set('Content-Type', 'application/json');

    return this.http
      .post<UserLoginResponse>(endpoint, { username, password  },  { headers } )
      .pipe(
        map(userData => {

          // sessionStorage.setItem('username', username);
          // sessionStorage.setItem('token', 'Bearer ' + userData.token);
          return userData;
        }),
        catchError(error => {
          return throwError(() => error); // 🔥 send error back
        })
      );


  }

  /* ******************************************************************************* */

  checkSubscription(): Observable<ApiResponse> {
    let remoteUrl = environment.subscriptionApiUrl;

    return new Observable();
    // return this.http.get<ApiResponse>(remoteUrl, { withCredentials: false }).pipe(
    //   catchError(this.errors.handleError<ApiResponse>('checkSubscription'))
    // );
  }

  getDeviceRegisterList(): Observable<DeviceRegister[]>{
    let myUrl = `${environment.apiUrl}` + `pos/device/getDeviceRegisterList`  ;

    return this.http.get<DeviceRegister[]>(myUrl).pipe(
            //tap( error ==> this.log('Fetched orders') ),
          catchError(this.errors.handleError<DeviceRegister[]>('getDeviceRegisterList()'))
        );

  }

    /* ************************************************************* */
  saveOpenBalance(cashierShift: CashierShift): Observable<CashierShift>{

    cashierShift.shiftStatus='OPEN';

    let myUrl = `${environment.apiUrl}` + `pos/cashierRegister/save`  ;
  
    return this.http.post<CashierShift>(myUrl, cashierShift).pipe(
      catchError(this.errors.handleError<CashierShift>('saveOpenBalance'))
    );
  
  }
    /* ************************************************************* */
  saveCloseBalance(cashierShift: CashierShift): Observable<CashierShift>{

    cashierShift.shiftStatus='CLOSED';

    let myUrl = `${environment.apiUrl}` + `pos/cashierRegister/save`  ;
  
    return this.http.post<CashierShift>(myUrl, cashierShift).pipe(
      catchError(this.errors.handleError<CashierShift>('saveCloseBalance'))
    );
  
  
  }

  /* ************************************************************* */
  getTodaysToken() : Observable<TokenNumber> {

    //This method is used to get current Token Number for the day for RestaurantPOS.
    
    let myUrl = `${environment.apiUrl}` + `tokenNumber/getTodaysToken`  ;

    return this.http.get<TokenNumber>(myUrl).pipe(
      catchError(this.errors.handleError<TokenNumber>('getTodaysToken'))
    );
  

  }
  
}
