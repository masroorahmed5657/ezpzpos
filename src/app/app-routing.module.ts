import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PosComponent } from './pos/pos.component';
import { AuthGaurdService } from './shared/auth-gaurd.service';


const routes: Routes = [
  {
    path: 'pos',
     component:PosComponent,canActivate:[AuthGaurdService]
  },
  {
    path: '',
     component:LoginComponent
  },
  {
    path: 'login',
     component:LoginComponent
  },
 {
     path:'**',
     component:LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
