import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Socio, SocioRequest } from '../models/socio';

@Injectable({
providedIn: 'root'
})
export class SociosService {

private http = inject(HttpClient);
private api = `${environment.apiUrl}/socios`;

listar() {
return this.http.get<Socio[]>(this.api);
}

registrar(data: SocioRequest) {
return this.http.post<Socio>(`${this.api}/registrar`, data);
}

actualizar(id: number, data: SocioRequest) {
return this.http.put<Socio>(`${this.api}/${id}`, data);
}

eliminar(id: number) {
return this.http.delete(`${this.api}/${id}`, {
responseType: 'text'
});
}
}
