import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Deuda, DeudaRequest } from '../models/deuda';

@Injectable({
  providedIn: 'root'
})
export class DeudasService {

  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/deudas`;

  listar(): Observable<Deuda[]> {
    return this.http.get<Deuda[]>(this.api);
  }

  obtener(id: number): Observable<Deuda> {
    return this.http.get<Deuda>(`${this.api}/${id}`);
  }

  registrar(data: DeudaRequest): Observable<Deuda> {
    return this.http.post<Deuda>(this.api, data);
  }

  actualizar(id: number, data: DeudaRequest): Observable<Deuda> {
    return this.http.put<Deuda>(`${this.api}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}