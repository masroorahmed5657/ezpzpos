import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/authconfig.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { PosComponent } from './pos/pos.component';
import { PosZubaidaComponent } from './pos-zubaida/pos-zubaida.component';
import { ReportsComponent } from './reports/reports.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DailysalereportComponent } from './dailysalereport/dailysalereport.component';
import { PosDemoComponent } from './pos-demo/pos-demo.component';
import { PosRestaurantComponent } from './pos-restaurant/pos-restaurant.component';
import { PosFashionComponent } from './pos-fashion/pos-fashion.component';
import { SalesAdjustmentComponent } from './sales-adjustment/sales-adjustment.component';
import { SalesAdjustmentItemsComponent } from './sales-adjustment-items/sales-adjustment-items.component';
import { AdjustmentSettlementComponent } from './adjustment-settlement/adjustment-settlement.component';
import { ReturnExchangeReportComponent } from './reports/return-exchange-report/return-exchange-report.component';
import { AdjustmentDashboardComponent } from './reports/adjustment-dashboard/adjustment-dashboard.component';
import { PosElectricComponent } from './pos-electric/pos-electric.component';
import { PosPaintComponent } from './pos-paint/pos-paint.component';
import { PosTradersComponent } from './pos-traders/pos-traders.component';
import { PosDineinComponent } from './pos-dinein/pos-dinein.component';
import { PosCardsComponent } from './pos-cards/pos-cards.component';
import { ZreportComponent } from './reports/zreport/zreport.component';
import { PosDeliveryComponent } from './pos-delivery/pos-delivery.component';
import { DeliveryDashboardComponent } from './delivery-dashboard/delivery-dashboard.component';
import { HomeComponent } from './home/home.component';
import { RiderComponent } from './rider/rider.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PosComponent,
    PosZubaidaComponent,
    ReportsComponent,
    DailysalereportComponent,
    PosDemoComponent,
    PosRestaurantComponent,
    PosFashionComponent,
    SalesAdjustmentComponent,
    SalesAdjustmentItemsComponent,
    AdjustmentSettlementComponent,
    ReturnExchangeReportComponent,
    AdjustmentDashboardComponent,
    PosElectricComponent,
    PosPaintComponent,
    PosTradersComponent,
    PosDineinComponent,
    PosCardsComponent,
    ZreportComponent,
    PosDeliveryComponent,
    DeliveryDashboardComponent,
    HomeComponent,
    RiderComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    NgxPaginationModule,
    NgApexchartsModule

    // NgxPrintModule,


  ],
  providers: [
    DatePipe,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  fatStar: any;
  constructor(library: FaIconLibrary) {
    library.addIcons(fasStar, farStar);

  }


}
