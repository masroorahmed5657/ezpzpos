import { Component, OnInit } from '@angular/core';
import { faLinkedin, faInstagram,  faTwitter, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faHome, faUndo, faSave, faCoffee, faSignIn } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2' ;   // 'sweetalert2/dist/sweetalert2.js';
import { AdminUser } from '../model/model-classes.model';
import { CacheService } from '../services/cache.service'
import { get } from 'jquery';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  projectName = environment.appName ;
    faCoffee = faCoffee;
    faTwitter = faTwitter;
    faFacebook = faFacebook;
    faGoogle = faGoogle;
    faSignIn=faSignIn;
    faUndo=faUndo;
    faSave=faSave;
    faHome=faHome;
    password: string = '';
    showPassword: boolean = false;

  registerFlag?: boolean;

  form!: FormGroup;
  loading = false;
  submitted = false;

  //Define all forms
  registerForm: FormGroup = new FormGroup({
    loginId: new FormControl(''),
    loginPassword: new FormControl(),
    email: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    userRole: new FormControl()
  });

    errorMsg!: string;
    versionNumber = environment.versionNumber ;
    appEnv=environment.appEnv;
    logoName = environment.logoName;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private loginService: LoginService,
      private cache: CacheService

  ) { }

  ngOnInit() {


    this.cache.resetAllData();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getPasswordType() {
    return this.showPassword ? 'text' : 'password';
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }


  register(){

    this.registerFlag=true;
  }
  onRegisterSave(){
    this.registerFlag=true;

    let adminUser = new AdminUser();
    this.convertFormToVar(adminUser);
    adminUser.userRole='USER';
    //adminUser.firstName='';
    //adminUser.lastName='';
    //adminUser.email='';

    this.loginService.registerUser(adminUser)
    .subscribe(data => {

      let userData = data;
      if (data !== undefined){
        if (data.userId !== null){
          this.alertWithSuccess(data.userId);
          this.registerFlag=false;
        }

      }
    });

  }
  /* ******************************************* */
  alertWithSuccess(userId: any){
    Swal.fire('Submit', `You have succesfully registered with ${this.projectName}!`, 'success')
  }
  alertWithSignin(loginId: any){
    Swal.fire('SignIn-' + loginId, `You have succesfully signed In with ${this.projectName}!`, 'success')
  }
  /* ****************************************** */
  onClear(){
    this.registerForm.reset();
  }
/* ************************************************** */

  signInClick(){
    //signin click event
    let adminUser = new AdminUser();
    adminUser = this.convertFormToVar(adminUser);

    this.loginService.authenticate(adminUser.loginId, adminUser.loginPassword).subscribe(data => {
      let userData = data;
      if (data !== undefined){
        if (!data.authenticated){
          this.errorMsg = 'Username or password is incorrect';
        }
        else if (data.adminUser === null){
          this.errorMsg = 'Username or password is incorrect';
        }
        else if (data.token==='_EMPTY'){
          this.errorMsg = 'Username or password is incorrect';
        }
        else {//if (data.adminUser?.userId !== null){
          sessionStorage.setItem('currentUser', JSON.stringify(data.adminUser));
          sessionStorage.setItem('Token', data.token);
          sessionStorage.setItem('UserLoginResponse', JSON.stringify(data));

          console.log(' Authentication Sucessful- forwarding to home:: ');

          //Now check, if user has record in Customer table
          //If this user already registered in ADMIN_USER table,
          //NOW check if this loginId exists in CUSTOMER table,
          //IF YES, then re-direct to Order Page
          //ELSE Take him to New Registeration Page
          //Else go to customer entry form
          /*if (data.newCustomer){
            Swal.fire('SignIn-' + data.adminUser?.loginId, 'Please complete your registration with Premium Auto Gallery!', 'success')
            this.router.navigate(['customer']);
          }
          else{*/
            this.alertWithSignin(data.adminUser?.loginId);
            this.router.navigate(['pos']);
          //}


          //this.registerFlag=false;
        }


      }
      else {
        this.errorMsg = 'Username or password is incorrect';
        console.log(this.errorMsg);
        //this.loading = false;
      }

    }
    );

  }
/* ****************************************** */
  convertFormToVar(adminUser: AdminUser) {
    //let adminUser = new AdminUser();

    adminUser.loginId = this.registerForm.get('loginId')?.value;
    adminUser.loginPassword = this.registerForm.get('loginPassword')?.value;
    if (this.registerFlag){
      adminUser.email = this.registerForm.get('email')?.value;
      adminUser.firstName = this.registerForm.get('firstName')?.value;
      adminUser.lastName = this.registerForm.get('lastName')?.value;
    }

    return adminUser;
  }


}
