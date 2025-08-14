import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  // Ruta relativa: en Docker pasa por Nginx (/api -> backend)
  private apiUrl = '/api/players';
  //  Si alguna vez volvés a dev sin proxy: private apiUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) {}

  // --- Helpers ---
  private getAuthHeaders(): HttpHeaders | undefined {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  private buildParams(filters: Record<string, any>): HttpParams {
    let params = new HttpParams();
    Object.entries(filters || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return params;
  }

  // --- API ---
  getPlayers(filters: {
    name?: string;
    club?: string;
    position?: string;
    version?: string;
    page?: number;
    limit?: number;
  }): Observable<any> {
    const params = this.buildParams(filters);
    const headers = this.getAuthHeaders();
    return this.http.get(this.apiUrl, { params, headers });
  }

  downloadCSV(filters: {
    name?: string;
    club?: string;
    position?: string;
    version?: string;
  }): Observable<Blob> {
    const params = this.buildParams(filters);
    const headers = this.getAuthHeaders();
    // El cast evita la queja de TS con responseType
    return this.http.get(`${this.apiUrl}/export`, { params, responseType: 'blob', headers }) as Observable<Blob>;
  }

  getPlayerById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  updatePlayer(id: string, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers });
  }

  createPlayer(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, payload, { headers });
  }
}
