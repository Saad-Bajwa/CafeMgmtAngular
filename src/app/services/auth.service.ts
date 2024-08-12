import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, ObservableLike } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../public/Model/User';
import { Response } from '../../../public/Model/Response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:23687/api/user'; // Replace with your API URL
  private tokenKey = 'auth-token';
  private userRoleKey = 'user-role'; // Renamed to make it consistent with the localStorage key
  private userEmailKey = 'user-email';
  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();
  private emailSubject = new BehaviorSubject<string | null>(null);
  emailSubject$ = this.emailSubject.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    // Load user role from local storage on service initialization
    this.loadUserRole();
    this.loadUserEmail();
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.setToken(response.token);
            this.updateUserRole();
            this.updateEmailRole();
          }
        }),
        catchError(this.handleError)
      );
  }

  signup(user: User): Observable<Response> {
    return this.http.post<Response>(`${this.apiUrl}/signup`, user).pipe(
      catchError(this.handleError)
    );
  }

  setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userRoleKey); // Ensure the role is removed
      localStorage.removeItem(this.userEmailKey);
      this.roleSubject.next(null);
      this.emailSubject.next(null);
    }
  }

  forgetPassword(email: string): Observable<string>{
    return this.http.post<string>(`${this.apiUrl}/forgetPassword`, {email : email});
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  updateUserRole(): void {
    const role = this.getUserRole();
    this.setRole(role);
    this.roleSubject.next(role);
  }
  updateEmailRole(): void{
    const email = this.getUserEmail();
    this.setEmail(email);
    this.emailSubject.next(email);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('Something went wrong; please try again later.');
  }

  decodeJwtToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return this.jwtHelper.decodeToken(token);
      } catch (err) {
        console.error(err);
        return null;
      }
    }
    return null;
  }

  getUserRole(): string | null {
    const token = this.decodeJwtToken();
    return token ? token.role : null;
  }
  getUserEmail(): string | null {
    const token = this.decodeJwtToken();
    return token? token.email : null;
  }

  setRole(role: string | null): void {
    if (this.isBrowser() && role) {
      localStorage.setItem(this.userRoleKey, role);
    }
  }

  setEmail(email: string | null): void {
    if(this.isBrowser() && email){
      localStorage.setItem(this.userEmailKey, email);
    }
  }

  loadUserRole(): void {
    if (this.isBrowser()) {
      const role = localStorage.getItem(this.userRoleKey);
      this.roleSubject.next(role);
    }
  }

  loadUserEmail(): void{
    if(this.isBrowser()){
      const email = localStorage.getItem(this.userEmailKey);
      this.emailSubject.next(email);
    }
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
