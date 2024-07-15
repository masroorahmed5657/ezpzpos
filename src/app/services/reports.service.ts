import { Injectable } from '@angular/core';
import { Errors } from '../errors/errors';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DailyCategorySale, DailyProductSale, DailySale,DailysubCategorySale, MonthlTotalyearning, MonthlyCategorySale, MonthlyProductSale, 
   MonthlySale, MonthlysubCategorySale, OrderSaleReportResponse, ProductWrapper, 
   TodayTotalearning, TotalCountOrders, TotalCountProducts, TotalCountSale, TotalCountSignup, WeeklyCategorySale, WeeklyProductSale, 
   WeeklySale, WeeklyTotalearning,WeeklysubCategorySale,YearlyCategorySale, YearlyProductSale, YearlySale, YearlysubCategorySale } from '../model/model-classes.model';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private myUrl = environment.apiUrl ; //http://localhost:8082/FASHION_API/category

  errors: Errors = new Errors();

  constructor(private http: HttpClient ) { }

  /* ************************************************************* */


//todayearning  api
  /* ************************************************************* */
  getTodayTotalEarning():Observable<TodayTotalearning[]>{
       let myUrl = `${this.myUrl}` + `reports/gettodaytotalearning` ;
       return this.http.get<TodayTotalearning[]>(myUrl).pipe(
       catchError(this.errors.handleError<TodayTotalearning[]>('getTodayTotalEarning'))
    );
 }
 /* ************************************************************* */

//getweeklyearning api
   /* ************************************************************* */
   getWeeklyTotalEarning():Observable<WeeklyTotalearning[]>{
    let myUrl = `${this.myUrl}` + `reports/weeklytotalearning` ;
    return this.http.get<WeeklyTotalearning[]>(myUrl).pipe(
    catchError(this.errors.handleError<WeeklyTotalearning[]>('getWeeklyTotalEarning'))
 );
}
/* ************************************************************* */


//getweeklyearning api
   /* ************************************************************* */
   getMonthlyTotalEarning():Observable<MonthlTotalyearning[]>{
    let myUrl = `${this.myUrl}` + `reports/getMonthlyTotalEarning` ;
    return this.http.get<MonthlTotalyearning[]>(myUrl).pipe(
    catchError(this.errors.handleError<MonthlTotalyearning[]>('getMonthlyTotalEarning'))
 );
}
/* ************************************************************* */


//getTotalCountSaleapi
   /* ************************************************************* */
   getTotalCountSale():Observable<TotalCountSale[]>{
    let myUrl = `${this.myUrl}` + `reports/getTotalCountSale` ;
    return this.http.get<TotalCountSale[]>(myUrl).pipe(
    catchError(this.errors.handleError<TotalCountSale[]>('getTotalCountSale'))
 );
}
/* ************************************************************* */



//getTotalOrderapi
   /* ************************************************************* */
   getTotalCountOrders():Observable<any>{
    let myUrl = `${this.myUrl}` + `reports/getTotalNewOrders` ;
    return this.http.get<any>(myUrl).pipe(
    catchError(this.errors.handleError<any>('getTotalCountOrders'))
 );
}
/* ************************************************************* */

//getTotalCountProductsapi
   /* ************************************************************* */
   getTotalCountProducts():Observable<any>{
    let myUrl = `${this.myUrl}` + `reports/getTotalActiveProducts` ;
    return this.http.get<any>(myUrl).pipe(
    catchError(this.errors.handleError<any>('getTotalCountProducts'))
 );
}
/* ************************************************************* */



//getTotalCountSignupsapi
   /* ************************************************************* */
   getTotalCountSignup():Observable<any>{
    let myUrl = `${this.myUrl}` + `reports/getTotalSubscribed` ;
    return this.http.get<any>(myUrl).pipe(
    catchError(this.errors.handleError<any>('getTotalCountSignup'))
 );
}
/* ************************************************************* */


   getTotalCountReviews():Observable<any>{
      let myUrl = `${this.myUrl}` + `reports/getTotalReviews` ;
      return this.http.get<any>(myUrl).pipe(
      catchError(this.errors.handleError<any>('getTotalReviews'))
   );
  }
  /* ************************************************************* */
  




//Dailsy Sales  api
   /* ************************************************************* */
   getDailySale():Observable<OrderSaleReportResponse>{
     let myUrl = `${this.myUrl}` + `reports/dailySaleTotal` ;
      return this.http.get<OrderSaleReportResponse>(myUrl).pipe(
    catchError(this.errors.handleError<OrderSaleReportResponse>('getDailySale'))
 );
}
/* ************************************************************* */


//Weekly Sales  api
   /* ************************************************************* */
   weeklySaleTotal():Observable<OrderSaleReportResponse>{
    let myUrl = `${this.myUrl}` + `reports/weeklySaleTotal` ;
     return this.http.get<OrderSaleReportResponse>(myUrl).pipe(
   catchError(this.errors.handleError<OrderSaleReportResponse>('weeklySaleTotal'))
);
}
/* ************************************************************* */


//Montly Sales  api
   /* ************************************************************* */
   getMonthlySale():Observable<OrderSaleReportResponse>{
    let myUrl = `${this.myUrl}` + `reports/currentMonthlySale` ;
     return this.http.get<OrderSaleReportResponse>(myUrl).pipe(
   catchError(this.errors.handleError<OrderSaleReportResponse>('getMonthlySale'))
);
}
/* ************************************************************* */


//Montly Sales  api
   /* ************************************************************* */
   getYearlySale():Observable<OrderSaleReportResponse>{
    let myUrl = `${this.myUrl}` + `reports/yearlySaleTotal` ;
     return this.http.get<OrderSaleReportResponse>(myUrl).pipe(
   catchError(this.errors.handleError<OrderSaleReportResponse>('getYearlySale'))
);
}
/* ************************************************************* */



//Daily Product Sales  api
   /* ************************************************************* */
   getDailyProductSale():Observable<DailyProductSale[]>{
    let myUrl = `${this.myUrl}` + `reports/dailyProductSale` ;
     return this.http.get<DailyProductSale[]>(myUrl).pipe(
   catchError(this.errors.handleError<DailyProductSale[]>('getDailyProductSale'))
);
}
/* ************************************************************* */

//weekly Product Sales  api
   /* ************************************************************* */
   getWeeklyProductSale():Observable<WeeklyProductSale[]>{
    let myUrl = `${this.myUrl}` + `reports/weeklyProductSale` ;
     return this.http.get<WeeklyProductSale[]>(myUrl).pipe(
   catchError(this.errors.handleError<WeeklyProductSale[]>('getWeeklyProductSale'))
);
}
/* ************************************************************* */


//monthly Product Sales  api
   /* ************************************************************* */
   getMonthlyProductSale():Observable<MonthlyProductSale[]>{
    let myUrl = `${this.myUrl}` + `reports/monthlyProductSale` ;
     return this.http.get<MonthlyProductSale[]>(myUrl).pipe(
   catchError(this.errors.handleError<MonthlyProductSale[]>('getMonthlyProductSale'))
);
}
/* ************************************************************* */


//Yearly Product Sales  api
   /* ************************************************************* */
   getYearlyProductSale():Observable<YearlyProductSale[]>{
    let myUrl = `${this.myUrl}` + `reports/yearlyProductSale` ;
     return this.http.get<YearlyProductSale[]>(myUrl).pipe(
   catchError(this.errors.handleError<YearlyProductSale[]>('getYearlyProductSale'))
);
}
/* ************************************************************* */





//Category category Sales  api
   /* ************************************************************* */
   getTotalCategorySale():Observable<OrderSaleReportResponse>{
    let myUrl = `${this.myUrl}` + `reports/getTotalCategorySale` ;
     return this.http.get<OrderSaleReportResponse>(myUrl).pipe(
   catchError(this.errors.handleError<OrderSaleReportResponse>('getTotalCategorySale'))
);
}
/* ************************************************************* */

//weekly category Sales  api
   /* ************************************************************* */
   getWeeklyCategorySale():Observable<WeeklyCategorySale[]>{
    let myUrl = `${this.myUrl}` + `reports/weeklyCategorySale` ;
     return this.http.get<WeeklyCategorySale[]>(myUrl).pipe(
   catchError(this.errors.handleError<WeeklyCategorySale[]>('getWeeklyCategorySale'))
);
}
/* ************************************************************* */


//monthly category Sales  api
   /* ************************************************************* */
   getMonthlyCategorySale():Observable<MonthlyCategorySale[]>{
    let myUrl = `${this.myUrl}` + `reports/monthlyCategorySale` ;
     return this.http.get<MonthlyCategorySale[]>(myUrl).pipe(
   catchError(this.errors.handleError<MonthlyCategorySale[]>('getmonthlyCategorySale'))
);
}
/* ************************************************************* */


//Yearly category Sales  api
   /* ************************************************************* */
   getYearlyCategorySale():Observable<YearlyCategorySale[]>{
    let myUrl = `${this.myUrl}` + `reports/yearlyCategorySale` ;
     return this.http.get<YearlyCategorySale[]>(myUrl).pipe(
   catchError(this.errors.handleError<YearlyCategorySale[]>('getYearlyCategorySale'))
);
}
/* ************************************************************* */





//daily subcategory Sales  api
   /* ************************************************************* */
   getDailysubCategorySale():Observable<DailysubCategorySale[]>{
    let myUrl = `${this.myUrl}` + `reports/dailySubCategorySale` ;
     return this.http.get<DailysubCategorySale[]>(myUrl).pipe(
   catchError(this.errors.handleError<DailysubCategorySale[]>('getDailySubCategorySale'))
);
}
/* ************************************************************* */

//weekly subcategory Sales  api
   /* ************************************************************* */
   getWeeklysubCategorySale():Observable<WeeklysubCategorySale[]>{
    let myUrl = `${this.myUrl}` + `reports/weeklysubCategorySale` ;
     return this.http.get<WeeklysubCategorySale[]>(myUrl).pipe(
   catchError(this.errors.handleError<WeeklysubCategorySale[]>('getWeeklysubCategorySale'))
);
}
/* ************************************************************* */


//monthly subcategory Sales  api
   /* ************************************************************* */
   getMonthlysubCategorySale():Observable<MonthlysubCategorySale[]>{
    let myUrl = `${this.myUrl}` + `reports/monthlysubCategorySale` ;
     return this.http.get<MonthlysubCategorySale[]>(myUrl).pipe(
   catchError(this.errors.handleError<MonthlysubCategorySale[]>('getMonthlysubCategorySale'))
);
}
/* ************************************************************* */


//Yearly subcategory Sales  api
   /* ************************************************************* */
   getYearlysubCategorySale():Observable<YearlysubCategorySale[]>{
    let myUrl = `${this.myUrl}` + `reports/yearlysubCategorySale` ;
     return this.http.get<YearlysubCategorySale[]>(myUrl).pipe(
   catchError(this.errors.handleError<YearlysubCategorySale[]>('getYearlysubCategorySale'))
);
}
/* ************************************************************* */


   /* ************************************************************* */
   getCurrentMonthSale():Observable<OrderSaleReportResponse>{
      let myUrl = `${this.myUrl}` + `reports/currentMonthlySale` ;
       return this.http.get<OrderSaleReportResponse>(myUrl).pipe(
     catchError(this.errors.handleError<OrderSaleReportResponse>('currentMonthlySale'))
  );
  }
  


}
