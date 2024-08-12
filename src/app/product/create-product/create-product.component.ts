import { Component, OnInit} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../../../../public/Model/Product';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit{
  productForm: FormGroup = new FormGroup({});
  btnSave : string = "Register";
  id: number = 0;
  product: Product = new Product();
  categories: any = [];
  constructor(
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private productService: ProductService,
    private actRoute : ActivatedRoute,
    private route : Router,
    private categoryService : CategoryService
  ){
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (response)=>{
        this.categories = response;
      },
      error: (error: HttpErrorResponse)=>{
        this.toastrService.error("Error in loading categories");
      }
    })
    this.actRoute.paramMap.subscribe((response)=>{
      const id = response.get('id');
      if(id){
        this.id = parseInt(id);
        this.getProductById(this.id);
      }
    })
  }

  getProductById(id: number){
    this.productService.getProductById(id).subscribe({
      next: (response)=>{
        this.product = response;
        this.productForm.patchValue(this.product);
      },
      error: (error: HttpErrorResponse)=>{
        this.toastrService.error(error.message || "Error in loading the product");
      }
    })
  }

  closeForm(){
    this.productForm.reset();
    this.route.navigate(['/product/list']);
  }
  onSubmit(){
    if(this.productForm.valid){
      this.product.name = this.productForm.get('name')?.value;
      this.product.price = this.productForm.get('price')?.value;
      this.product.categoryId = this.productForm.get('category')?.value;
      this.product.description = this.productForm.get('description')?.value;
      if(this.id === 0){
        this.productService.addProduct(this.product).subscribe({
          next: (response)=>{
            this.toastrService.success("Product added successfully");
            this.route.navigate(['/product/list']);
          },
          error: (error: HttpErrorResponse)=>{
            this.toastrService.error(error.message || "Error in adding product");
          }
        })
      }
      else{
        this.product.id = this.id;
        this.productService.updateProduct(this.product).subscribe({
          next: (response)=>{
            this.toastrService.success("Product updated successfully");
            this.route.navigate(['/product/list']);
          },
          error: (error: HttpErrorResponse)=>{
            this.toastrService.error(error.message || "Error in updating product");
          }
        })
      }
    }
  }
}
