import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Puesto, PuestoRequest, SocioOption } from '../models/puesto';

@Injectable({
providedIn: 'root'
})
export class PuestosService {

private http = inject(HttpClient);

private api = `${environment.apiUrl}/api/puestos`;
private sociosApi = `${environment.apiUrl}/socios`;

listar() {
return this.http.get<Puesto[]>(this.api);
}

registrar(data: PuestoRequest) {
return this.http.post<Puesto>(`${this.api}/registrar`, data);
}

actualizar(id: number, data: PuestoRequest) {
return this.http.put<Puesto>(`${this.api}/${id}`, data);
}

eliminar(id: number) {
return this.http.delete(`${this.api}/${id}`, {
responseType: 'text'
});
}

listarSocios() {
return this.http.get<SocioOption[]>(this.sociosApi);
}

}
