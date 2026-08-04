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


const routes: Routes = [
  {
    path: 'pos',
     component:PosZubaidaComponent, canActivate:[AuthGaurdService, LicenseGuard]
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
    path: '',
     component:LoginComponent
  },
  {
    path: 'login',
     component:LoginComponent
  },
//  {
//      path:'**',
//      component:LoginComponent
//   },
  {
    path: 'reports/:reportType',
    component: ReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
