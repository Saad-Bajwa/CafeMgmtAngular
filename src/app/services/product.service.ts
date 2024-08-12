import { Injectable } from '@angular/core';
import { Product } from '../../../public/Model/Product';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError,Subject } from 'rxjs';
import { tap,catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:23687/api/product'; 
  constructor(private http: HttpClient, private authService: AuthService) { }
  addProduct(product: Product): Observable<string>{
    return this.http.post<string>(`${this.apiUrl}/addProduct`, product, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
  getAllProduct():Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}/getAllProduct`,{
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
  getProductById(id:number):Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/getProductById/${id}`,{
      headers:{
        'Authorization' : `Bearer ${this.authService.getToken()}`
      }
    });
  }
  updateProduct(product: Product): Observable<string>{
    return this.http.put<string>(`${this.apiUrl}/updateProduct`, product, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  deleteProduct(id: number): Observable<string>{
    return this.http.delete<string>(`${this.apiUrl}/deleteProduct/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  updateProductStatus(product: Product): Observable<string>{
    return this.http.post<string>(`${this.apiUrl}/updateProductStatus`, product, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  getProductByCategory(id: number):Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}/getProductByCategory/${id}`,{
      headers:{
        'Authorization' : `Bearer ${this.authService.getToken()}`
      }
    });
  }
}
