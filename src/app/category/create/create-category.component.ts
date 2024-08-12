import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../../../public/Model/Category';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent implements OnInit {
  categoryForm : FormGroup = new FormGroup({});
  id: number = 0;
  btnSave: string = "Register";
  category : Category = new Category();
  constructor(private toastrService: ToastrService,
    private fb: FormBuilder,
    private route : Router,
    private router: ActivatedRoute,
    private categoryService: CategoryService
  ){
    this.categoryForm = this.fb.group({
      catName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.router.paramMap.subscribe((response)=>{
      const id = response.get('id');
      if(id){
        this.id = parseInt(id);
        this.getCategoryById(this.id);
      }
    })
  }

  onSubmit(){
    if(this.categoryForm.valid){
      this.category.name = this.categoryForm.get('catName')?.value;
      if(this.id === 0){
        this.categoryService.addCategory(this.category).subscribe({
          next:(response)=>{
            this.toastrService.success("Category added successfully");
            this.route.navigate(['/category/list']);
          },
          error:(err: HttpErrorResponse)=>{
            this.toastrService.error(err.error?.message || 'Error in adding category');
          }
        })
      }
      else{
        this.category.id = this.id;
        this.categoryService.updateCategory(this.category).subscribe({
          next:(response)=>{
            this.toastrService.success("Category updated successfully");
            this.route.navigate(['/category/list']);
          },
          error: (err: HttpErrorResponse)=>{
            this.toastrService.error(err.error?.message || 'Error in updating category');
          }
        })
      }
    }
    else{
      this.toastrService.error("Please fill all required fields");
    }
  }

  getCategoryById(id: number){
    this.categoryService.getCategoryById(id).subscribe({
      next:(response)=>{
        this.category = response;
        this.categoryForm.patchValue({
          catName: this.category.name
        })
      },
      error:(err: HttpErrorResponse)=>{
        this.toastrService.error(err.error?.message || 'Error in loading category');
      }
    })
  }

  closeForm(){
    this.categoryForm.reset();
    this.route.navigate(['/category/list']);
  }
}

