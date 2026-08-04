import { Component, OnInit } from '@angular/core';
import { faLinkedin, faInstagram, faTwitter, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faHome, faUndo, faSave, faCoffee, faSignIn } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';   // 'sweetalert2/dist/sweetalert2.js';
import { AdminUser } from '../model/model-classes.model';
import { CacheService } from '../services/cache.service';
import { Observable, delay } from 'rxjs';
import { get } from 'jquery';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-login',
  //imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../assets/css/custom.css', '../../assets/css/responsive.css']
})
export class LoginComponent implements OnInit {


  spinnerDataLoad = false;
  projectName = environment.appName;
  faCoffee = faCoffee;
  faTwitter = faTwitter;
  faFacebook = faFacebook;
  faGoogle = faGoogle;
  faSignIn = faSignIn;
  faUndo = faUndo;
  faSave = faSave;
  faHome = faHome;
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
  versionNumber = environment.versionNumber;
  appEnv = environment.appEnv;
  logoName = environment.logoName;
  apiDB = environment.dbEnv;
  posUrl = '/' + environment.posUrl;
  subscriptionFlag = true;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private cache: CacheService,
    private reactivateForm: ReactiveFormsModule

  ) { }

  ngOnInit() {

    // let currentUser = sessionStorage.getItem('currentUser');
    // let token = sessionStorage.getItem('Token');
    // if ((currentUser!==undefined || currentUser!==null) && (token!==undefined || token!==null)) {
    //   this.router.navigate(['pos']);
    // }    


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


  register() {

    this.registerFlag = true;
  }
  onRegisterSave() {
    this.registerFlag = true;

    let adminUser = new AdminUser();
    this.convertFormToVar(adminUser);
    adminUser.userRole = 'USER';
    //adminUser.firstName='';
    //adminUser.lastName='';
    //adminUser.email='';

    this.loginService.registerUser(adminUser)
      .subscribe(data => {

        let userData = data;
        if (data !== undefined) {
          if (data.userId !== null) {
            this.alertWithSuccess(data.userId);
            this.registerFlag = false;
          }

        }
      });

  }
  /* ******************************************* */
  alertWithSuccess(userId: any) {
    Swal.fire('Submit', `You have succesfully registered with ${this.projectName}!`, 'success')



  }
  alertWithSignin(loginId: any) {

    //Swal.fire('SignIn-' + loginId, `You have succesfully signed In with ${this.projectName}!`, 'success');
    Swal.fire({ title: 'SignIn-' + loginId, timer: 1000, text: `You have succesfully signed In with ${this.projectName}!`, icon: 'success' });
    //delay(5000);


  }
  /* ****************************************** */
  onClear() {
    this.registerForm.reset();
  }
  /* ************************************************** */

async showSubscriptionWarning() {
  await Swal.fire({
    title: 'WARNING',
    text: 'Your POS Subscription not verified. Please contact TECHMACI',
    icon: 'warning',
    timer: 4000,
    timerProgressBar: false,
    allowOutsideClick: false,
    showConfirmButton: false
  });

  // 👇 Code here runs AFTER Swal closes
  Swal.fire('Allow', 'Your POS will work', 'error');



}

signInClick2(){
  this.showSubscriptionWarning();

}

  signInClick() {
    //signin click event

    this.spinnerDataLoad = true;
    this.resetCache();

    let adminUser = new AdminUser();
    adminUser = this.convertFormToVar(adminUser);

    //this.showSubscriptionWarning();


    ////////////////////////////////////////////////////////////////////
    //Code changed on Jan 29, 2026
    ///////////////////////////////////////////////////////////////////
    //Code Added on Dec 31, 2024, to check subscription
    //this.loginService.checkSubscription().subscribe(data => 
      
      {
      // let apiResp = data;
      // if (apiResp !== undefined) {
      //   if (apiResp.statusCode! < 0) {
      //     Swal.fire('WARNING', 'Your POS Subscription has expired. Please contact TECHMACI', 'error');
      //     this.spinnerDataLoad = false;
      //     this.resetCache();
      //     this.subscriptionFlag = false;
      //     return;
      //   }
      //   else {
      //     this.subscriptionFlag = true;
      //   }
      // }
      // else if(apiResp===undefined){
      //     Swal.fire({
      //       title: 'WARNING',
      //       text: 'Your POS Subscription not verified. Please contact TECHMACI',
      //       icon: 'warning',
      //       confirmButtonText: 'OK',
      //       allowOutsideClick: false
      //     });

      //   this.subscriptionFlag = true;
      // }
      // else {
      //   this.subscriptionFlag = true;
      // }

this.subscriptionFlag = true;

      if (this.subscriptionFlag) {
        this.loginService.authenticate(adminUser.loginId, adminUser.loginPassword).subscribe((data): any => {
          let userData = data;
          if (userData !== undefined) {
            if (!userData.authenticated) {
              this.errorMsg = 'Username or password is incorrect';
              this.spinnerDataLoad = false;
            }
            else if (userData.adminUser === null) {
              this.errorMsg = 'Username or password is incorrect';
              this.spinnerDataLoad = false;
            }
            else if (userData.token === '_EMPTY') {
              this.errorMsg = 'Username or password is incorrect';
              this.spinnerDataLoad = false;
            }
            else {//if (data.adminUser?.userId !== null){
              this.playAudio();
              sessionStorage.setItem('username', adminUser.loginId);
              sessionStorage.setItem('token', 'Bearer ' + userData.token);

              sessionStorage.setItem('currentUser', JSON.stringify(data.adminUser));
              sessionStorage.setItem('Token', JSON.stringify(userData.token));
              sessionStorage.setItem('UserLoginResponse', JSON.stringify(userData));

              this.alertWithSignin(userData.adminUser?.loginId);
              this.spinnerDataLoad = false;
              //this.router.navigate(['posRestaurant']);
              this.router.navigate([this.posUrl]);

            }
          }

        });

      }
      else {
        this.errorMsg = 'Username or password is incorrect';
        console.log(this.errorMsg);
        this.spinnerDataLoad = false;
        //this.loading = false;
      }
    };
    //});



    ////////////////////////////////////////////////////////////////////



  }
  /* ****************************************** */
  convertFormToVar(adminUser: AdminUser) {
    //let adminUser = new AdminUser();

    adminUser.loginId = this.registerForm.get('loginId')?.value;
    adminUser.loginPassword = this.registerForm.get('loginPassword')?.value;
    if (this.registerFlag) {
      adminUser.email = this.registerForm.get('email')?.value;
      adminUser.firstName = this.registerForm.get('firstName')?.value;
      adminUser.lastName = this.registerForm.get('lastName')?.value;
    }

    return adminUser;
  }


  resetCache() {
    this.cache.set('currentUser', null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    sessionStorage.clear();

    this.cache.resetAllData();

  }


  playAudio() {
    let audio = new Audio();

    audio.src = "../../assets/audio/assalamu_alaikum.mp3"
    audio.load();
    audio.play();
    
    let audio2 = new Audio();
    audio2.src = "../../assets/audio/play.mp3"
    audio2.load();
    audio2.play();


  }

}
