import { Component, OnInit} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../public/Model/User';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'user-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  userForm : FormGroup = new FormGroup({});
  user : User = new User();
  passwordFieldType : string = 'password';
  btnSave: string = "Register";
  id: number = 0;
  constructor(private toastrService : ToastrService,
    private userService : UserServiceService,
    private fb : FormBuilder,
    private route : Router,
    private actRoute : ActivatedRoute
  ){
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      contactNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this.actRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id){
        this.id = parseInt(id);
        this.getUserById(this.id);
        this.btnSave = "Update";
      }
    })
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit(){
    
    if (this.userForm.valid) {
      this.user.name = this.userForm.get('name')?.value;
      this.user.contactNumber = this.userForm.get('contactNumber')?.value;
      this.user.email = this.userForm.get('email')?.value;
      this.user.password = this.userForm.get('password')?.value;
      if(this.user.id === 0){
        this.userService.createUser(this.user).subscribe({
          next:(response)=>{
            console.log(response);
            this.toastrService.success(response.Message ||  "Signup Successfull");
            this.route.navigate(['/user/list']);
          },
          error: (err : HttpErrorResponse)=>{
            if(err.status === 400){
              this.toastrService.error(err.error?.message || "Email Already Exists");
            }
            else if(err.status === 500){
              this.toastrService.error("An internal server error occurred. Please try again later.");
            }
            else{
              this.toastrService.error("Error in Creating User.");
            }
          }
        })
      }
      else{
        this.userService.updateUser(this.user).subscribe({
          next:(response)=>{
            console.log(response);
            this.toastrService.success(  "User Updated Successfully");
            this.route.navigate(['/user/list']);
          },
          error: (err : HttpErrorResponse)=>{
            if(err.status === 400){
              this.toastrService.error("Email Already Exists");
            }
            else if(err.status === 500){
              this.toastrService.error("An internal server error occurred. Please try again later.");
            }
            else{
              this.toastrService.error("Error in Creating User.");
            }
          }
        })
      }
    } else {
      this.toastrService.error("Please fill the form correctly!!!");
    }
  }

  getUserById(id : number){
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        console.log(response);
        this.user = response;
        this.userForm.setValue({name: response.name, contactNumber: response.contactNumber, email: response.email, password: response.password});
      },
      error: (err) => {
        this.toastrService.error(err.error?.message || 'Something went wrong');
      }
    });
  }
  
  closeForm(){
    this.route.navigate(['/user/list']);
  }
}
