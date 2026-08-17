import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PosComponent } from './pos/pos.component';
import { AuthGaurdService } from './shared/auth-gaurd.service';
import { PosZubaidaComponent } from './pos-zubaida/pos-zubaida.component';
import { ReportsComponent } from './reports/reports.component';
import { DailysalereportComponent } from './dailysalereport/dailysalereport.component';
import { PosDemoComponent } from './pos-demo/pos-demo.component';
import { PosRestaurantComponent } from './pos-restaurant/pos-restaurant.component';
import { LicenseGuard } from './shared/license-guard';
import { SalesAdjustmentComponent } from './sales-adjustment/sales-adjustment.component';
import { PosElectricComponent } from './pos-electric/pos-electric.component';
import { PosFashionComponent } from './pos-fashion/pos-fashion.component';
import { PosPaintComponent } from './pos-paint/pos-paint.component';
import { PosTradersComponent } from './pos-traders/pos-traders.component';
import { PosDineinComponent } from './pos-dinein/pos-dinein.component';
import { PosCardsComponent } from './pos-cards/pos-cards.component';
import { ZreportComponent } from './reports/zreport/zreport.component';
import { PosDeliveryComponent } from './pos-delivery/pos-delivery.component';
import { DeliveryDashboardComponent } from './delivery-dashboard/delivery-dashboard.component';
import { HomeComponent } from './home/home.component';
import { RiderComponent } from './rider/rider.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
     component:LoginComponent
  },
  {
    path: 'login',
     component:LoginComponent
  },
  {
    path: 'pos',
     component:PosZubaidaComponent, canActivate:[AuthGaurdService, LicenseGuard]
  },
  {
    path: 'posHome',
     component:PosComponent, canActivate:[AuthGaurdService]
  },

  {
    path: 'posDemo',
     component:PosDemoComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'posRestaurant',
     component:PosRestaurantComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'posCards',
     component:PosCardsComponent, canActivate:[AuthGaurdService, ]
  },

   {
    path: 'saleReturns',
     component:SalesAdjustmentComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'posElectric',
     component:PosElectricComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'posFashion',
     component:PosFashionComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'posPaint',
     component:PosPaintComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'posTraders',
     component:PosTradersComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'posDinein/:tableId',
     component:PosDineinComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'posDelivery',
     component:PosDeliveryComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'posDeliveryDashboard',
     component:DeliveryDashboardComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'rider',
    component: RiderComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'home',
     component:HomeComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'dashboard',
     component:DashboardComponent, canActivate:[AuthGaurdService, ]
  },
 
  {
    path: 'reports/:reportType',
    component: ReportsComponent, canActivate:[AuthGaurdService, ]
  },
  {
    path: 'zReport',
    component: ZreportComponent, canActivate:[AuthGaurdService, ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
