import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface PagoListaItem {
  id: number;
  fechaRegistro: string;
  metodo: string;
  montoAcumulado: number;
  estado: string;
}

interface PagoResponse {
  id: number;
  fechaRegistro: string;
  metodo: string;
  montoAcumulado: number;
  estado: string;
  detalles?: Array<{
    id: number;
    pago: unknown;
    comprobante: unknown;
  }>;

}

@Component({
  selector: 'app-pagos',
  imports: [DatePipe, FormsModule],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export class PagosComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly pagosUrl = 'http://localhost:9090/pago/listar';

  pagos: PagoListaItem[] = [];
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

    this.http.get<PagoResponse[]>(this.pagosUrl).subscribe({
      next: (data) => {
        this.pagos = (data ?? []).map((item) => this.mapearPago(item));
        this.paginaActual = 1;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.pagos = [];
        } else {
          this.error = 'No se pudo cargar la lista de pagos.';
        }
        this.paginaActual = 1;
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get pagosFiltrados(): PagoListaItem[] {
    const termino = this.filtroBusqueda.trim().toLowerCase();
    if (!termino) return this.pagos;

    return this.pagos.filter((pago) => {
      const idTexto = String(pago.id ?? '').toLowerCase();
      const fechaTexto = pago.fechaRegistro?.toLowerCase?.() ?? '';
      const metodoTexto = pago.metodo?.toLowerCase?.() ?? '';
      const montoTexto = String(pago.montoAcumulado ?? '').toLowerCase();

      return (
        idTexto.includes(termino) ||
        fechaTexto.includes(termino) ||
        metodoTexto.includes(termino) ||
        montoTexto.includes(termino)
      );
    });
  }

  get pagosPaginados(): PagoListaItem[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.pagosFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    const total = Math.ceil(this.pagosFiltrados.length / this.tamanoPagina);
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

  irARegistrarPago(): void {
    this.router.navigate(['/pagos/registrar']);
  }

  private mapearPago(item: PagoResponse): PagoListaItem {
    return {
      id: item.id,
      fechaRegistro: item.fechaRegistro ?? '',
      metodo: item.metodo ?? '',
      montoAcumulado: item.montoAcumulado ?? 0,
      estado: item.estado
    };
  }
}
