import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Pago } from '../models/pago';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pago`;

  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(
      `${this.apiUrl}/listar`
    );
  }

  registrar(pago: Pago): Observable<Pago> {
  return this.http.post<Pago>(
    `${this.apiUrl}/registrar`,
    pago
    );
  }


}