import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardData } from '../model/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

   constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get<DashboardData>(
      '/api/dashboard'
    );
  }
}
