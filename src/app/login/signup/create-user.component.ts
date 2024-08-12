import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../public/Model/User';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { debug } from 'console';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  signUpForm: FormGroup = new FormGroup({});
  passwordFieldType: string = 'password';
  user : User = new User();
  constructor(private fb : FormBuilder,
    private authSevice : AuthService,
    private toastrService: ToastrService,
    private route : Router
  ){
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      contactNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }
  onSubmit(){
    if (this.signUpForm.valid) {
      this.user.name = this.signUpForm.get('name')?.value;
      this.user.contactNumber = this.signUpForm.get('contactNumber')?.value;
      this.user.email = this.signUpForm.get('email')?.value;
      this.user.password = this.signUpForm.get('password')?.value;
      this.authSevice.signup(this.user).subscribe({
        next:(response)=>{
          console.log(response);
          this.toastrService.success(response.Message ||  "Signup Successfull");
          this.route.navigateByUrl('/login');
        },
        error: (err : HttpErrorResponse)=>{
          console.log(err);
          console.log(err.error?.message);
          console.log(err.error?.error?.message);
          if(err.status === 400){
            this.toastrService.error(err.error?.message || "Email Already Exists");
          }
          else if(err.status === 500){
            this.toastrService.error("An internal server error occurred. Please try again later.");
          }
          else{
            this.toastrService.error("Signup Failed! Please enter correct details.");
          }
        }
      })
    } else {
      this.toastrService.error("Please fill the form correctly!!!");
    }
  }
  togglePasswordVisibility(){
    this.passwordFieldType = this.passwordFieldType==='password'?'text':'password';
  }
}
