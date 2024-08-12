import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DashboardService } from '../services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { chart } from 'highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  lineChart = new Chart({});
  pieChart = new Chart({});
  role : string | null = null;
  isAuthenticated = false;

  constructor(private toastrService: ToastrService, private dashboardService: DashboardService, private authService: AuthService) { }
  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.role$.subscribe(role => {
      this.role = role;
    });

    // Reload user role if the page is refreshed
    if (this.isAuthenticated) {
      this.authService.loadUserRole();
    }
    console.log(this.role);
    if(this.role === 'admin'){
      this.dashboardService.getAllOrdersData().subscribe({
        next: (response) => {
          const customerNames = response.map((order) => order.Name);
          const totalAmount = response.map((order) => order.TotalAmount);
          this.lineChart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'Customer Orders'
            },
            xAxis: {
              categories: customerNames,
              title: {
                text: 'Customer Name'
              }
            },
            yAxis: {
              title: {
                text: 'Total Amount'
              }
            },
            credits: {
              enabled: true
            },
            series: [
              {
                type: 'line',
                name: 'Customer Data' ,
                data: totalAmount
              }
            ]
          });
        }
      })
      this.dashboardService.getOrderCountByCustomer().subscribe({
        next:(response)=>{
          const data = response.map((order) => [order.Name, order.OrderCount]);
          this.pieChart = new Chart({
            chart: {
              type: 'pie'
            },
            title: {
              text: 'Order Count by Customer'
            },
            credits: {
              enabled: false
            },
            series: [
              {
                type: 'pie',
                name: 'Order Count',
                data: data
              }
            ]
          });
        }
      });
    }
    else{
      this.dashboardService.getAllOrdersData().subscribe({
        next: (response) => {
          const customerNames = response.map((order) => order.Name);
          const name = customerNames[0];
          const totalAmount = response.map((order) => order.TotalAmount);
          this.lineChart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: name + ' Orders'
            },
            xAxis: {
              categories: customerNames
            },
            yAxis: {
              title: {
                text: 'Total Amount'
              }
            },
            credits: {
              enabled: true
            },
            series: [
              {
                type: 'line',
                name: name + ' Order Amount' ,
                data: totalAmount
              }
            ]
          });
        }
      });
      this.dashboardService.getOrderCountByCustomer().subscribe({
        next:(response)=>{
          const data = response.map((order) => [order.Name, order.OrderCount]);
          this.pieChart = new Chart({
            chart: {
              type: 'pie'
            },
            title: {
              text: 'Product Quantity by Customer'
            },
            credits: {
              enabled: false
            },
            series: [
              {
                type: 'pie',
                name: 'Product Quantity Count',
                data: data
              }
            ]
          });
        }
      });
    }
  }
}
