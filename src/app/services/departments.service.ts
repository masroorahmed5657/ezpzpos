import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Errors } from '../errors/errors';
import { AppLoggerService } from './app-logger.service';
import { Observable, catchError } from 'rxjs';
import { Category, Departments } from '../model/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  private url = environment.apiUrl ; //http://localhost:9080/FOODY_API/
  private errors: Errors = new Errors();

  constructor(private http: HttpClient,
              private appLogService: AppLoggerService) { }



/* ****************************************************************** */
  getDepartmentList(): Observable<Departments[]>{

    let myUrl = `${this.url}` + `departments/findAll`  ;


    return this.http.get<Departments[]>(myUrl).pipe(
        //tap( error ==> this.log('Fetched orders') ),
      catchError(this.errors.handleError<Departments[]>('getDepartmentList'))
    );
  }

}
