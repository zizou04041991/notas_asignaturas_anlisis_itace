import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // Use a mock API endpoint, like JSONPlaceholder, for demonstration
  private apiUrl = 'http://localhost:8000/auth/admin/';

  constructor(private http: HttpClient) {}

  // Read (GET) - Get all users
  getAdmins(params: string = ''): Observable<any> {
    if (params === '') return this.http.get<any>(this.apiUrl);
    return this.http.get<any>(this.apiUrl + params);
  }

  // Read (GET) - Get a single user by ID
  getAdmin(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<any>(url);
  }

  // Create (POST) - Add a new user
  createAdmin(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Update (PUT) - Update an existing user
  updateAdmin(id: number, user: any): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.patch<any>(url, user);
  }

  // Delete (DELETE) - Remove a user
  deleteAdmin(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete<any>(url);
  }
}
