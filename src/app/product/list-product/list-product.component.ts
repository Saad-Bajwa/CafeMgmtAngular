import { Component,OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../../../../public/Model/Product';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css'
})
export class ListProductComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'category','status' ,'actions'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private productService : ProductService,
    private toastrService: ToastrService,
    private route: Router
  )
  {

  }
  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(){
    this.productService.getAllProduct().subscribe({
      next: (response)=>{
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
      },
      error: (error: HttpErrorResponse)=>{
        
      }
    })
  }
  openModal(){
    this.route.navigate(['/product/create']);
  }
  onStatusToggle(product: Product) {
    const updatedStatus = product.status === 'true' ? 'false' : 'true'; // Toggle status
    const updatedProduct: Product = { ...product, status: updatedStatus };
    this.productService.updateProductStatus(updatedProduct).subscribe({
      next: (response) => {
        product.status = updatedStatus; // Update local status
        this.toastrService.success('User status updated successfully', 'Close', {
          timeOut: 1000,
        });
      },
      error: (err: HttpErrorResponse)=>{
          this.toastrService.error( 'Error in loding product',"Error",{
          timeOut: 1000,
          progressBar: true,
          closeButton: true
        });
      }
    })
  }
  editProduct(id: number){
    this.route.navigate(['/product/create/'+id]);
  }
  deleteProduct(id: number){
    if(confirm("Are you sure you want to delete this product?")){
      this.productService.deleteProduct(id).subscribe({
        next: (response)=>{
          this.loadProducts();
          this.toastrService.success("Product deleted successfully");
        },
        error: (err: HttpErrorResponse)=>{
          this.toastrService.error('Error in deleting product',"Error",{
          timeOut: 1000,
          progressBar: true,
          closeButton: true
        });
        }
      })
    }
  }
}
