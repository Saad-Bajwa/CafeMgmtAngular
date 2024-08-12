import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../public/Model/User';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({});
  forgotPasswordForm : FormGroup = new FormGroup({});
  passwordFieldType: string = 'password';
  user : User = new User();
  constructor(private fb : FormBuilder,
    private authSevice : AuthService,
    private toastrService: ToastrService,
    private route : Router,
    private spinner: NgxSpinnerService
  ){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.forgotPasswordForm = this.fb.group({
      email : ['', [Validators.required, Validators.email]]
    })
  }
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.user.email = this.loginForm.get('username')?.value;
      this.user.password = this.loginForm.get('password')?.value;
      this.authSevice.login(this.user).subscribe({
       next:(response)=>{
        this.toastrService.success("Login Successfull");
        this.route.navigateByUrl('/dashboard');
       },
       error: (err)=>{
        this.toastrService.error(err.error?.message || "Login Failed! Please enter correct username or password");
       }
      })
      // Handle login logic here, e.g., call to authentication service
    } else {
      this.toastrService.error("Please fill the form correctly!!!");
    }
  }
  openModal(){
    $('#forgotPasswordModal').modal('show');
  }
  closeModal(){
    $('#forgotPasswordModal').modal('hide');
    this.forgotPasswordForm.reset();
  }

  onForgetPassword(){
    if(this.forgotPasswordForm.valid){
      this.spinner.show();
      this.authSevice.forgetPassword(this.forgotPasswordForm.get('email')?.value).subscribe({
        next:(response)=>{
          this.spinner.hide();
          this.closeModal();
          this.toastrService.success("Password sent to your email");
        },
        error: (err)=>{
          this.closeModal();
          this.toastrService.error("Error in sending password");
        }
      })
    }
    else{
      this.toastrService.error("Please enter valid email");
    }
  }
}
