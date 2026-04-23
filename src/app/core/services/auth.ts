import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private baseUrl = 'http://127.0.0.1:8000/auth';

  constructor(private http: HttpClient) {}

  //  LOGIN
  login(email: string, password: string) {

    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    return this.http.post<any>(`${this.baseUrl}/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(res => {
        //  store BOTH tokens
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
      })
    );
  }

  //  REGISTER
  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  //  LOGOUT (REAL LOGOUT)
  logout() {
    const refresh = localStorage.getItem('refresh_token');

    return this.http.post(`${this.baseUrl}/logout`, {
      refresh_token: refresh
    }).pipe(
      tap(() => {
        localStorage.clear(); //  remove all tokens
      })
    );
  }

  //  LOGIN CHECK
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  //  GET ACCESS TOKEN
  getToken() {
    return localStorage.getItem('access_token');
  }

  //  SAFE ROLE EXTRACTION
  getUserRole(): string | null {
    try {
      const token = this.getToken();
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null; //  prevent crash
    }
  }
}
