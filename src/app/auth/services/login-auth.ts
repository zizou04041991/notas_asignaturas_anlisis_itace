import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AdminInterface, StudentInterface } from '../../core/constant/user-login';

@Injectable({
  providedIn: 'root',
})
export class LoginAuth {
  // Use a mock API endpoint, like JSONPlaceholder, for demonstration
  private apiUrlLogin = 'http://localhost:8000/auth/login/';
  private apiUrlRefresh = 'http://localhost:8000/auth/login/refresh/';
  private apiUrlChangePassword = 'http://localhost:8000/auth/login/change-password/';
  private apiUrlResetPasword = 'http://localhost:8000/auth/login/reset-password/';
  public tokenUser = 'user';
  public tokenAccess = 'access';
  public tokenRefresh = 'refresh';
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  resetUserPassword(userId: number): Observable<any> {
  return this.http.post(`${this.apiUrlResetPasword}${userId}/`, {});
}

  logout(): void {
    localStorage.removeItem(this.tokenAccess);
    localStorage.removeItem(this.tokenRefresh);
    localStorage.removeItem(this.tokenUser);
    this.isAuthenticatedSubject.next(false);
  }
  refreshToken() {
    const refresh = localStorage.getItem(this.tokenRefresh) as string;

    return this.http.post<any>(this.apiUrlRefresh, { refresh });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const body = { old_password: oldPassword, new_password: newPassword };
    return this.http.post<any>(this.apiUrlChangePassword, body);
  }

  isAuthenticated(): boolean {
    // Verifica si el token existe en localStorage
    return !!localStorage.getItem(this.tokenAccess);
  }

  // Opcional: observable para suscribirse a cambios de autenticación
  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Create (POST) - Add a new user
  login(user: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrlLogin, user);
  }
}
