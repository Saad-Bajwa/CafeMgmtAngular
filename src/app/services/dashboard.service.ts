import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Order {
  Name: string;
  TotalAmount: number;
}

export interface OrderCount { 
  Name: string;
  OrderCount : Number;
} 

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:23687/api/dashboard';
  constructor(private http: HttpClient, private authService: AuthService) { }
  getAllOrdersData(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getAllOrdersData`,{
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
  getOrderCountByCustomer(): Observable<OrderCount[]>{
    return this.http.get<OrderCount[]>(`${this.apiUrl}/getOrderCountByCustomer`,{
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
  }
}
