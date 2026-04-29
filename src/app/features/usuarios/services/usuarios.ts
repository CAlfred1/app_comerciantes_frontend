import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  listar() {
    return this.http.get<any[]>(
      `${this.apiUrl}/listar`
    );
  }

  registrar(data: any) {
    return this.http.post(
      `${this.apiUrl}/registrar-con-rol`,
      data
    );
  }

  actualizar(id: number, data: any) {
    return this.http.put(
      `${this.apiUrl}/actualizar/${id}`,
      data
    );
  }

}