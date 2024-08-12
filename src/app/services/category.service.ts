import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../../public/Model/Category';
import { AuthService } from './auth.service';
import { Observable, throwError,Subject, ObservedValuesFromArray } from 'rxjs';
import { tap,catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:23687/api/category'; 
  constructor(private http: HttpClient,private authService: AuthService) { }

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiUrl}/getCategories`,{
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
  deleteCategory(id: number): Observable<string>{
    return this.http.delete<string>(`${this.apiUrl}/deleteCategory/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  addCategory(category: Category): Observable<string>{
    return this.http.post<string>(`${this.apiUrl}/addCategory`, category, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  getCategoryById(id: number): Observable<Category>{
    return this.http.get<Category>(`${this.apiUrl}/getCategoryById/${id}`,{
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
  updateCategory(category: Category): Observable<string>{
    return this.http.put<string>(`${this.apiUrl}/updateCategory`, category, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}` 
      }
    });
  }
}
