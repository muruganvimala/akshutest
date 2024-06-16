import { Component,ElementRef, Renderer2 } from '@angular/core';
import * as jQuery from 'jquery';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/API/api.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import Swal from 'sweetalert2';


declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

// Login Component
export class LoginComponent {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;

  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();

  loggedIn: boolean = false;
  //imgArr:string[] =["avatar1.jpg","avatar2.png","avatar3.png","avatar4.png","avatar5.png","avatar6.png","avatar7.png","avatar8.png","avatar9.png","avatar10.png","avatar11.png"];

  constructor(private formBuilder: UntypedFormBuilder, private api: ApiService
    , private router: Router,private el: ElementRef, private renderer: Renderer2) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {
    console.log("local storage length " + sessionStorage.length);
    $('.modal-backdrop').removeClass('show');
    $('.modal-backdrop').removeClass('modal-backdrop');
    //$('.modal-backdrop').removeClass('show');
    // if (sessionStorage.length != 0) {
    //   this.router.navigate(["layout"]);
    // }

    //swap array randomly
    //this.shuffleArray(this.imgArr);
    // if (sessionStorage.getItem('currentUser')) {
    //   this.router.navigate(['/']);
    // }
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // shuffleArray(array: any[]): void {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  //   }
  // }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    // Login Api
    if (this.loginForm.valid) {
      setTimeout(() => {
        this.showLoader();
      }, 100);

      let username = this.loginForm.get('username')!.value;
      let password = this.loginForm.get('password')!.value;
      //console.log("login triggered api ", username, "  ", password);
      this.api.postData(`api/Authentication/GetToken?username=${username}&password=${password}`)
        .subscribe(
          res => {
            console.log('login api triggered');
            this.loggedIn = true;
            const { token, expires, userRole, user } = res;
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('expires', expires);
            sessionStorage.setItem('firstName', user.firstname);
            sessionStorage.setItem('displayName', user.displayname);
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('userRole', userRole);
            setTimeout(() => {
              this.closeLoader();
              if (token) {
                this.router.navigate(['/app']);
              }
              //console.log('local storage count is ' + sessionStorage.length);
            }, 1000);
          },
          error => {
            this.closeLoader();;
            Swal.fire({
              title: 'Alert!',
              text: 'Please Enter Valid credentials',
              icon: 'warning',
              showConfirmButton: false, timer: 3000
            })
            console.error('Error:', error);
          }
        );

    }
    else {
      this.closeLoader();
    }

  }

  /* Password Hide/Show */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  showLoader():void {
    $('#loaderAnimation').modal('show');
  }
  closeLoader():void {
    $('#loaderAnimation').modal('hide');
    }

}