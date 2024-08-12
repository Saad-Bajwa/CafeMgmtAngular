import { Component, ViewChild, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Order } from '../../../../public/Model/Order';
import { HttpErrorResponse } from '@angular/common/http';
import { response } from 'express';
import { json } from 'stream/consumers';
import { OrderPopupComponent } from '../order-popup/order-popup.component';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css'
})
export class ViewOrdersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'totalAmount', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private orderService: OrderService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders() {
    this.orderService.getAllBills().subscribe({
      next: (response) => {
        console.log(response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        this.toastrService.error(err.error?.message || 'Error in loading orders');
      }
    });
  }



  deleteBill(id: number) {
    if (confirm("Are you sure you want to delete record?")) {
      this.orderService.deleteBill(id).subscribe({
        next: (response) => {
          this.loadOrders();
          this.toastrService.success("Record Deleted Successfully");
        },
        error: (err: HttpErrorResponse) => {
          this.toastrService.error("Error in processing request");
        }
      })
    }
  }

  downloadBill(uuid: string) {
    this.orderService.getPdf(uuid).subscribe({
      next: (pdfBlob: Blob) => {
        this.downloadFile(pdfBlob, `${uuid}.pdf`);
      },
      error: (err: HttpErrorResponse) => {
        this.toastrService.error("Error in downloding bill");
      }
    });
  }

  downloadFile(data: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  openOrderPopup(order: Order) {
    const prodcutDetails = JSON.parse(order.productDetails);
    this.dialog.open(OrderPopupComponent, {
      width: '600px',
      data: { ...order, prodcutDetails }
    });
  }
}
