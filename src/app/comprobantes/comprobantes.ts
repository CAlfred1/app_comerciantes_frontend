import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SocioResumen {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  estado: boolean;
}

interface PuestoResumen {
  id: number;
  codigo: string;
  descripcion: string;
  estado: boolean;
}

interface MotivoResumen {
  id: number;
  descripcion: string;
}

interface DeudaResponse {
  id: number;
  socio: SocioResumen;
  puesto: PuestoResumen;
  motivo: MotivoResumen;
  monto: number;
  fecha: string;
  estado: string;
  fechaPago: string | null;
  fechaCreacion: string;
}

interface ComprobanteListaItem {
  id: number;
  socio: string;
  puesto: string;
  motivo: string;
  fecha: string;
  monto: number;
  estado: string;
}

@Component({
  selector: 'app-comprobantes',
  imports: [DatePipe, FormsModule],
  templateUrl: './comprobantes.html',
  styleUrl: './comprobantes.css',
})
export class ComprobantesComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly deudasUrl = 'http://localhost:9090/deudas';

  comprobantes: ComprobanteListaItem[] = [];
  filtroBusqueda = '';
  tamanosPagina = [5, 10, 20];
  tamanoPagina = 5;
  paginaActual = 1;
  cargando = false;
  error = '';

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<DeudaResponse[]>(this.deudasUrl).subscribe({
      next: (data) => {
        this.comprobantes = (data ?? []).map((deuda) => ({
          id: deuda.id,
          socio: deuda.socio?.nombre ?? '',
          puesto: deuda.puesto ? `${deuda.puesto.codigo} - ${deuda.puesto.descripcion}` : '',
          motivo: deuda.motivo?.descripcion ?? '',
          fecha: deuda.fecha,
          monto: deuda.monto ?? 0,
          estado: deuda.estado ?? '',
        }));
        this.paginaActual = 1;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.comprobantes = [];
        } else {
          this.error = 'No se pudo cargar la lista para comprobantes.';
        }
        this.paginaActual = 1;
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get comprobantesFiltrados(): ComprobanteListaItem[] {
    const termino = this.filtroBusqueda.trim().toLowerCase();
    if (!termino) return this.comprobantes;

    return this.comprobantes.filter((item) => {
      const idTexto = String(item.id ?? '').toLowerCase();
      const socioTexto = item.socio?.toLowerCase?.() ?? '';
      const puestoTexto = item.puesto?.toLowerCase?.() ?? '';
      const motivoTexto = item.motivo?.toLowerCase?.() ?? '';
      const fechaTexto = item.fecha?.toLowerCase?.() ?? '';
      const montoTexto = String(item.monto ?? '').toLowerCase();
      const estadoTexto = item.estado?.toLowerCase?.() ?? '';

      return (
        idTexto.includes(termino) ||
        socioTexto.includes(termino) ||
        puestoTexto.includes(termino) ||
        motivoTexto.includes(termino) ||
        fechaTexto.includes(termino) ||
        montoTexto.includes(termino) ||
        estadoTexto.includes(termino)
      );
    });
  }

  get comprobantesPaginados(): ComprobanteListaItem[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.comprobantesFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    const total = Math.ceil(this.comprobantesFiltrados.length / this.tamanoPagina);
    return total > 0 ? total : 1;
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
  }

  cambiarTamanoPagina(): void {
    this.paginaActual = 1;
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.paginaActual = 1;
  }

  irPaginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  irPaginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  irARegistrarComprobante(): void {
    this.router.navigate(['/deudas']);
  }
}
