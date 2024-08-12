import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../services/order.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface ProductDataSource {
  category: string;
  product: string;
  price: number;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  customerForm: FormGroup;
  productForm: FormGroup;
  products = new MatTableDataSource<ProductDataSource>();
  drpCategory: any[] = [];
  drpProduct: Product[] = [];
  displayedColumns: string[] = ['category', 'product', 'price', 'quantity', 'total', 'action'];
  userEmail : string | null = null;
  isAuthenticated : boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private authService : AuthService
  ) {
    this.productForm = this.fb.group({});
    this.customerForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.emailSubject$.subscribe(email => {
      this.userEmail = email;
    });
    console.log(this.userEmail);
    // Reload user role if the page is refreshed
    if (this.isAuthenticated) {
      this.authService.loadUserEmail();
    }
    this.initializeForms();
    this.loadCategories();
  }

  initializeForms() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: [this.userEmail, [Validators.required, Validators.email]],
      contactNo: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      totalAmount: [{ value: 0, disabled: true }, Validators.required]
    });

    this.productForm = this.fb.group({
      category: ['', Validators.required],
      product: ['', Validators.required],
      price: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      quantity: [1, [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      total: [{ value: '', disabled: true }, Validators.required]
    });

    this.productForm.get('category')?.valueChanges.subscribe(categoryId => {
      this.onChangeCategory(categoryId);
    });

    this.productForm.get('product')?.valueChanges.subscribe(productId => {
      this.onChangeProduct(productId);
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.drpCategory = response;
      },
      error: (error: HttpErrorResponse) => {
        // this.toastrService.error('Error in loading categories');
      }
    });
  }

  onChangeCategory(categoryId: number) {
    this.productService.getProductByCategory(categoryId).subscribe({
      next: (response) => {
        this.drpProduct = response;
        this.productForm.patchValue({ product: '', price: '', quantity: 1, total: '' });
      },
      error: (error: HttpErrorResponse) => {
  
      }
    });
  }

  onChangeProduct(productId: number) {
    const selectedProduct = this.drpProduct.find(product => product.id === productId);
    if (selectedProduct) {
      this.productForm.patchValue({ price: selectedProduct.price, quantity: 1 });
      this.calculateProductTotal();
    }
  }

  calculateProductTotal() {
    const price = this.productForm.get('price')?.value || 0;
    const quantity = this.productForm.get('quantity')?.value || 0;
    const total = price * quantity;
    this.productForm.get('total')?.setValue(total);
  }

  addProduct() {
    if (this.productForm.valid) {
      const productRef = this.productForm.getRawValue();
      const proId = this.productForm.get('product')?.value;
      const catId = this.productForm.get('category')?.value;
  
      // Find the selected product and category
      const selectedProduct = this.drpProduct.find(p => p.id === proId);
      const selectedCategory = this.drpCategory.find(c => c.id === catId);
  
      if (selectedProduct) {
        productRef['product'] = selectedProduct.name; // Set the product name
      } else {
        productRef['product'] = 'Unknown Product'; // Handle case when product is not found
      }
  
      if (selectedCategory) {
        productRef['category'] = selectedCategory.name; // Set the category name
      } else {
        productRef['category'] = 'Unknown Category'; // Handle case when category is not found
      }
  
      // Add product to the data source
      const currentProducts = this.products.data;
      this.products.data = [...currentProducts, productRef];

      // Reset product form
      this.productForm.reset({ quantity: 1 });
  
      // Recalculate the total amount
      this.calculateTotalAmount();
    } else {
      this.toastrService.warning('Please fill in all product fields', 'Warning');
    }
  }
  

  calculateTotalAmount() {
    const totalAmount = this.products.data.reduce((sum, product) => sum + product.total, 0);
    this.customerForm.get('totalAmount')?.setValue(totalAmount);
  }

  removeProduct(index: number) {
    const currentProducts = this.products.data;
    currentProducts.splice(index, 1);
    this.products.data = [...currentProducts];
    this.calculateTotalAmount();
  }

  onSubmit() {
    if (this.customerForm.valid && this.products.data.length > 0) {
      const bill = {
        name: this.customerForm.get('name')?.value,
        email: this.customerForm.get('email')?.value,
        contactNo: this.customerForm.get('contactNo')?.value,
        paymentMethod: this.customerForm.get('paymentMethod')?.value,
        totalAmount: this.customerForm.get('totalAmount')?.value,
        productDetails: JSON.stringify(this.products.data),
      };
  
      // Call generateReport API
      this.orderService.generateReport(bill).subscribe({
        next: (response: any) => {
          this.toastrService.success('Order submitted successfully', 'Success');
  
          // Extract UUID from the response
          const uuid = response.uuid;
  
          // Call getPdf API with the UUID
          this.orderService.getPdf(uuid).subscribe({
            next: (pdfBlob: Blob) => {
              this.openPdfInNewTab(pdfBlob, `${uuid}.pdf`);
            },
            error: (err: HttpErrorResponse) => {
              this.toastrService.error('Failed to download PDF', 'Error');
            }
          });
  
          this.resetForms();
        },
        error: (err: HttpErrorResponse) => {
          this.toastrService.error('Failed to submit order', 'Error');
        }
      });
    } else {
      this.toastrService.warning(
        'Please fill in all required fields and add at least one product',
        'Warning'
      );
    }
  }
  
  // Method to download the PDF file
  // private downloadFile(data: Blob, fileName: string): void {
  //   const url = window.URL.createObjectURL(data);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }
  

  openPdfInNewTab(data: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(data);
    window.open(url); // Opens PDF in a new tab
  }

  

  resetForms() {
    this.customerForm.reset();
    this.productForm.reset({ quantity: 1 });
    this.products.data = [];
  }
}
