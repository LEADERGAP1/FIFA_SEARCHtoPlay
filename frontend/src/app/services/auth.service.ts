import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token?: string;
  access_token?: string;
  user?: { id: number; nombre: string; email: string };
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Ruta relativa: pasa por Nginx en Docker y sirve también en dev con proxy
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        const token = res?.access_token ?? res?.token;
        if (token) localStorage.setItem('token', token);
        if (res?.user) localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): { id: number; nombre: string; email: string } | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }
}
