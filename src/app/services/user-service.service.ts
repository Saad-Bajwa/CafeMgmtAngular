import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError,Subject } from 'rxjs';
import { tap,catchError } from 'rxjs/operators';
import { User } from '../../../public/Model/User';
import { Response } from '../../../public/Model/Response';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:23687/api/user'; 
  // private modalState = new Subject<boolean>();
  // modalState$ = this.modalState.asObservable();
  constructor(private http: HttpClient,private authService: AuthService) { }

  //Modal Methods
  // openModal(){
  //   this.modalState.next(true);
  // }
  // closeModal(){
  //   this.modalState.next(false);
  // }
  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}/getAllUsers`);
  }
  createUser(user: User): Observable<Response>{
    return this.http.post<Response>(`${this.apiUrl}/signup`, user).pipe(
      catchError(this.handleError)
    )
  }

  updateUserStatus(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateUserStatus`, user, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('Something went wrong; please try again later.');
  }

  getUserById(id: number): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/getUserById/${id}`,{
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  updateUser(user: User): Observable<string>{
    return this.http.post<string>(`${this.apiUrl}/updateUser`, user, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
  deleteUser(id: number): Observable<string>{
    return this.http.post<string>(`${this.apiUrl}/deleteUser/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
}
