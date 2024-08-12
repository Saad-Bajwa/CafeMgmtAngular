import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../../public/Model/User';
import { UserServiceService } from '../../services/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'user-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'contactNumber', 'status' , 'actions'];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService : UserServiceService,
    private toastrService : ToastrService,
    private dialog: MatDialog,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        console.log(response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        this.toastrService.error(err.error?.message || 'Something went wrong');
      }
    });
  }

  onStatusToggle(user: User) {
    const updatedStatus = user.status === 'true' ? 'false' : 'true'; // Toggle status
    const updatedUser: User = { ...user, status: updatedStatus };

    this.userService.updateUserStatus(updatedUser).subscribe({
      next: (response) => {
        user.status = updatedStatus; // Update local status
        this.toastrService.success('User status updated successfully', 'Close', {
          timeOut: 1000,
        });
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.toastrService.error('Unauthorized access', 'Close', {
            timeOut: 1000,
          });
        } else {
          this.toastrService.error('Failed to update status', 'Close', {
            timeOut: 1000,
          });
        }
      }
    });
  }

  editUser(id:number){
    this.route.navigate(['/user/create/'+id]);
  }

  openModal(){
    this.route.navigate(['/user/create']);
  }

  deleteUser(id:number){
    if(confirm("Are you sure you want to delete record?")){
      this.userService.deleteUser(id).subscribe({
        next: (response) => {
          this.loadUsers();
          this.toastrService.success("Record Deleted Successfully");
        },
        error: (err: HttpErrorResponse)=>{
          this.toastrService.error("Error in processing request");
        }
      })
    }
  }

}
