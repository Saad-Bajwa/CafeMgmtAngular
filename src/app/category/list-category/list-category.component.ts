import { Component,ViewChild, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../../../public/Model/Category';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.css'
})
export class ListCategoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Category>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private toastrService: ToastrService,
    private categoryService: CategoryService,
    private route : Router) {
    
  }
  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response)=>{
        console.log(response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
      },
      error: (err : HttpErrorResponse) => {
        
      }
    });
  }
  editCat(id: number){
    this.route.navigate(['/category/create/'+id]);
  }
  deleteCat(id: number){
    if(confirm("Are you sure you want to delete category?")){
      this.categoryService.deleteCategory(id).subscribe({
        next: (response)=>{
          this.loadCategories();
          this.toastrService.success("Category deleted successfully");
        },
        error: (err: HttpErrorResponse) => {
          this.toastrService.error(err.error?.message || 'Error in deleting category');
        }
      });
    }
  }
  openModal(){
    this.route.navigate(['/category/create']);
  }
}
