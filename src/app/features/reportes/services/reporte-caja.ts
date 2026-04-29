import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ReporteCajaDto } from '../models/reporte-caja';

@Injectable({
  providedIn: 'root'
})
export class ReporteCajaService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reporte`;

  porRango(
    fechaInicio: string,
    fechaFin: string
  ): Observable<ReporteCajaDto> {
    return this.http.get<ReporteCajaDto>(
      `${this.apiUrl}/caja-rango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }

  porMes(
    anio: number,
    mes: number
  ): Observable<ReporteCajaDto> {
    return this.http.get<ReporteCajaDto>(
      `${this.apiUrl}/caja-mensual?anio=${anio}&mes=${mes}`
    );
  }

  pdfRango(
    fechaInicio: string,
    fechaFin: string
  ) {
    return this.http.get(
      `${this.apiUrl}/caja-rango/pdf?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
      { responseType: 'blob' }
    );
  }

  pdfMensual(
    anio: number,
    mes: number
  ) {
    return this.http.get(
      `${this.apiUrl}/caja-mensual/pdf?anio=${anio}&mes=${mes}`,
      { responseType: 'blob' }
    );
  }
}