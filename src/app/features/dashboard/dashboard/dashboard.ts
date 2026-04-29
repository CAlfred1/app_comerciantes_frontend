import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  Router,
  RouterModule,
  NavigationEnd
} from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  usuario = '';
  fechaActual = new Date();

  totalSocios = 0;
  totalPuestos = 0;
  totalDeudas = 0;
  totalUsuarios = 0;

  totalPagos = 0;
  totalComprobantes = 0;
  cajaMensual = 0;

  ngOnInit(): void {

    this.cargarUsuario();
    this.cargarDatos();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        if (this.router.url === '/dashboard') {
          this.cargarDatos();
        }

      });
  }

  cargarUsuario(): void {
    const data = localStorage.getItem('usuario');

    if (data) {
      const user = JSON.parse(data);
      this.usuario = user.username;
    }
  }

  cargarDatos(): void {

    this.http.get<any[]>(`${environment.apiUrl}/socios`)
      .subscribe(resp => {
        this.totalSocios = resp.length;
        this.cdr.detectChanges();
      });

    this.http.get<any[]>(`${environment.apiUrl}/api/puestos`)
      .subscribe(resp => {
        this.totalPuestos = resp.length;
        this.cdr.detectChanges();
      });

    this.http.get<any[]>(`${environment.apiUrl}/deudas`)
      .subscribe(resp => {
        this.totalDeudas =
          resp.filter(x => x.estado === 'PENDIENTE').length;

        this.cdr.detectChanges();
      });

    this.http.get<any[]>(`${environment.apiUrl}/auth/listar`)
      .subscribe(resp => {
        this.totalUsuarios = resp.length;
        this.cdr.detectChanges();
      });
    
    this.http.get<any[]>(`${environment.apiUrl}/pago/listar`)
      .subscribe(resp => {
        this.totalPagos = resp.length;
        this.cdr.detectChanges();
      });

    this.http.get<any[]>(`${environment.apiUrl}/comprobante/listar`)
      .subscribe(resp => {
        this.totalComprobantes = resp.length;
        this.cdr.detectChanges();
      });

    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;

    this.http.get<any>(
    `${environment.apiUrl}/reporte/caja-mensual?anio=${anio}&mes=${mes}`)
      .subscribe(resp => {

        this.cajaMensual =
        resp.totalGeneral ?? 0;

        this.cdr.detectChanges();
      });
  }
}