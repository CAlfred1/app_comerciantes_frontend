import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(usuario => {
          localStorage.setItem('usuario', JSON.stringify(usuario));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('usuario');
  }

  getUsuario(): Usuario | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getUsuario();
  }

  tieneRol(nombreRol: string): boolean {
    const usuario = this.getUsuario();

    if (!usuario?.roles) return false;

    return usuario.roles.some(
      (rol: any) => rol.nombre === nombreRol
    );
  }
}