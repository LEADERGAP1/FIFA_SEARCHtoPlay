import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private apiUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) {}

  getPlayers(filters: {
    name?: string;
    club?: string;
    position?: string;
    version?: string;
    page?: number;
    limit?: number;
  }): Observable<any> {
    let params = new HttpParams();

    for (const key in filters) {
      const value = filters[key as keyof typeof filters];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    }

    return this.http.get(this.apiUrl, { params });
  }

  downloadCSV(filters: {
    name?: string;
    club?: string;
    position?: string;
    version?: string;
  }): Observable<Blob> {
    let params = new HttpParams();

    for (const key in filters) {
      const value = filters[key as keyof typeof filters];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    }

    const exportUrl = `${this.apiUrl}/export`;

    return this.http.get(exportUrl, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Nuevo: Obtener jugador por ID
   */
  getPlayerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updatePlayer(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  createPlayer(payload: any) {
    return this.http.post<any>(this.apiUrl, payload);
  }
  
  
}

