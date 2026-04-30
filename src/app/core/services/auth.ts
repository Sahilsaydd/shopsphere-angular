import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private baseUrl = 'http://127.0.0.1:8000/auth';

  constructor(private http: HttpClient) {}






getUserDetails() {
  return this.http.get<any>('http://127.0.0.1:8000/auth/userdetails');
}



  login(email: string, password: string) {

    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    return this.http.post<any>(`${this.baseUrl}/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(res => {
        const payload = JSON.parse(atob(res.access_token.split('.')[1]));
        console.log('User Role:', payload.role);
        const role = payload.role;
        if( role === 'admin') {
          localStorage.setItem('admin_access_token', res.access_token);
          localStorage.setItem('admin_refresh_token', res.refresh_token);
        }else{
           sessionStorage.setItem('user_access_token', res.access_token);
          sessionStorage.setItem('user_refresh_token', res.refresh_token);
        }

      })
    );
  }



  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }



  logout(role: 'admin' | 'user') {

    let refresh = null;
     if (role === 'admin') {
    refresh = localStorage.getItem('admin_refresh_token');
  } else if (role === 'user') {
    refresh = sessionStorage.getItem('user_refresh_token');
  }

  return this.http.post(`${this.baseUrl}/logout`, {
    refresh_token: refresh
  }).pipe(
    tap(() => {

      if (role === 'admin') {
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
      } else if (role === 'user') {
        sessionStorage.removeItem('user_access_token');
        sessionStorage.removeItem('user_refresh_token');
      }
    })
  );
}




 isLoggedIn(role: 'admin' | 'user'): boolean {
   if (role === 'admin') {
    return !!localStorage.getItem('admin_access_token');
  }

  if (role === 'user') {
    return !!sessionStorage.getItem('user_access_token');
  }

  return !!(
    localStorage.getItem('admin_access_token') ||
    sessionStorage.getItem('user_access_token')
  );
}

 getToken(url?: string) {

  if (url && url.includes('/admin')) {
    return localStorage.getItem('admin_access_token');
  }

  return sessionStorage.getItem('user_access_token');
}

  getUserRole(type?: 'admin' | 'user'): string | null {
  try {
    let token = null;

    if (type === 'admin') {
      token = localStorage.getItem('admin_access_token');
    } else if (type === 'user') {
      token = sessionStorage.getItem('user_access_token');
    } else {
      token =
        localStorage.getItem('admin_access_token') ||
        sessionStorage.getItem('user_access_token');
    }

    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;

  } catch {
    return null;
  }
}
}
