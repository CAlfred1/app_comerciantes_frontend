import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comprobante } from '../models/comprobante';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/comprobante`;

  listar(): Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(`${this.apiUrl}/listar`);
  }

  obtenerPorId(id: number): Observable<Comprobante> {
    return this.http.get<Comprobante>(`${this.apiUrl}/${id}`);
  }

  registrar(comprobante: Comprobante): Observable<Comprobante> {
    return this.http.post<Comprobante>(
      `${this.apiUrl}/registrar`,
      comprobante
    );
  }

  actualizar(id: number, comprobante: Comprobante): Observable<Comprobante> {
    return this.http.put<Comprobante>(
      `${this.apiUrl}/actualizar/${id}`,
      comprobante
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/eliminar/${id}`
    );
  }
}