import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectItaceService {
  // Use a mock API endpoint, like JSONPlaceholder, for demonstration
  private apiUrl = 'http://localhost:8000/api/asignatura/';

  constructor(private http: HttpClient) {}

  // Read (GET) - Get all users
  getSubjectItaces(params: string = ''): Observable<any> {
    if (params === '') return this.http.get<any>(this.apiUrl);
    return this.http.get<any>(this.apiUrl + params);
  }

  // Read (GET) - Get a single user by ID
  getSubjectItace(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<any>(url);
  }

  // Create (POST) - Add a new user
  createSubjectItace(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Update (PUT) - Update an existing user
  updateSubjectItace(id: number, user: any): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.patch<any>(url, user);
  }

  // Delete (DELETE) - Remove a user
  deleteSubjectItace(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete<any>(url);
  }
}
