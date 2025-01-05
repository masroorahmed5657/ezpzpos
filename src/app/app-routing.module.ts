import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PosComponent } from './pos/pos.component';
import { AuthGaurdService } from './shared/auth-gaurd.service';
import { PosZubaidaComponent } from './pos-zubaida/pos-zubaida.component';
import { ReportsComponent } from './reports/reports.component';
import { DailysalereportComponent } from './dailysalereport/dailysalereport.component';
import { PosDemoComponent } from './pos-demo/pos-demo.component';


const routes: Routes = [
  {
    path: 'pos',
     component:PosDemoComponent,canActivate:[AuthGaurdService]
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
