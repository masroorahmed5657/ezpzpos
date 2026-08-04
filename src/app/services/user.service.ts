import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Address, AdminUser, UserLoginResponse } from '../model/model-classes.model';
//import { Errors } from '../errors/errors';
import { environment } from 'src/environments/environment';
import { Errors } from '../errors/errors';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myUrl = environment.apiUrl ; 
  errors: Errors = new Errors();

  constructor(private http:HttpClient) { }

  getUserList(): Observable<AdminUser[]>{

    let myUrl = `${this.myUrl}` + `adminuser/findAllAdminUser` ;
  
    return this.http.get<AdminUser[]>(myUrl).pipe(
  
      catchError(this.errors.handleError<AdminUser[]>('AdminList'))
    );
  }
}
