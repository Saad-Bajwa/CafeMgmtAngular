import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../../public/Model/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:23687/api/bill';
  constructor(private http: HttpClient, private authService: AuthService) { }
  generateReport(orderData: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/generateReport`, orderData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  getPdf(uuid: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/getPdf`, { uuid: uuid }, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
      responseType: 'blob', // Specify response type as blob
    });
  }

  getAllBills(): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiUrl}/getAllBills`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  deleteBill(id: number): Observable<string>{
    return this.http.delete<string>(`${this.apiUrl}/deleteBill/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
}
