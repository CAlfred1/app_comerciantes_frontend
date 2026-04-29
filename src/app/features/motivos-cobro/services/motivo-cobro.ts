import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { MotivoCobro } from '../models/motivo-cobro';

@Injectable({
  providedIn: 'root'
})
export class MotivoCobroService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/motivo-cobro`;

  listar(): Observable<MotivoCobro[]> {
    return this.http.get<MotivoCobro[]>(
      `${this.apiUrl}/listar`
    );
  }

  registrar(motivo: MotivoCobro): Observable<MotivoCobro> {
  return this.http.post<MotivoCobro>(
    `${this.apiUrl}/registrar`,
    motivo
  );

  }

  obtenerPorId(id: number): Observable<MotivoCobro> {
  return this.http.get<MotivoCobro>(
    `${this.apiUrl}/${id}`
    );
  }

  actualizar(
    id: number,
    motivo: MotivoCobro
  ): Observable<MotivoCobro> {
    return this.http.put<MotivoCobro>(
      `${this.apiUrl}/actualizar/${id}`,
      motivo
    );
  }

}