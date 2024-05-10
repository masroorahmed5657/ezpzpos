import { Injectable } from '@angular/core';
import { AdminUser } from '../model/model-classes.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private endpoint: string = environment.apiUrl + 'authenticate'; //http://localhost:9080/PAG_WS/login

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentAdminUser = {};
  constructor(private httpClient: HttpClient, public router: Router) {}

  // Provide username and password for authentication, and once authentication is successful,
//store JWT token in session
authenticate(username: string, password: any) {
  return this.httpClient
    .post<any>(this.endpoint, { username, password })
    .pipe(
      map(userData => {
        sessionStorage.setItem("username", username);
        let tokenStr = "Bearer " + userData.token;
        sessionStorage.setItem("token", tokenStr);
        return userData;
      })
    );
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem("username");
    console.log(!(user === null));
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem("username");
  }



}
