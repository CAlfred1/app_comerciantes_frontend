import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';

interface SocioResumen {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  estado: boolean;
}

interface SocioOption {
  id: number;
  etiqueta: string;
}

class DetalleComprobante {
  constructor(
    public id: number,
    public idDeuda: number,
    public montoPagado: number,
    public fechaRegistro: string,
  ) {}
}

class Comprobante {
  constructor(
    public id: number,
    public numero: string,
    public tipo: string,
    public fecha: string,
    public total: number,
    public vuelto: number,
    public idPuesto: number,
    public idUsuario: number | null,
    public listaDetalle: DetalleComprobante[],
    public seleccionado: boolean = false,
    public estado:string
  ) {}
}

@Component({
  selector: 'app-pagos-registro',
  imports: [DatePipe, FormsModule, NgSelectComponent],
  templateUrl: './pagos-registro.html',
  styleUrl: './pagos-registro.css',
})
export class PagosRegistroComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly sociosUrl = 'http://localhost:9090/socios';
  private readonly comprobanteUrl = 'http://localhost:9090/comprobante/listar';

  socioSeleccionado: number | null = null;
  fechaPago: string = new Date().toISOString().split('T')[0];
  montoAcumulado = 0;
  metodoPagoSeleccionado: number | null = null;
  mostrarExitoGuardado = false;
  cargandoComprobantes = false;
  errorComprobantes = '';
  filtroBusqueda = '';
  tamanosPagina = [5, 10, 20];
  tamanoPagina = 5;
  paginaActual = 1;

  metodosPago = [
    { id: 1, nombre: 'Efectivo' },
    { id: 2, nombre: 'Yape' },
    { id: 3, nombre: 'Transferencia' },
    { id: 4, nombre: 'Tarjeta' }
  ];

  socios: SocioOption[] = [];

  comprobantes: Comprobante[] = [];

  ngOnInit(): void {
    this.cargarSocios();
    this.listarComprobantes();
  }

  cargarSocios(): void {
    this.http.get<SocioResumen[]>(this.sociosUrl).subscribe({
      next: (data) => {
        this.socios = data.map((socio) => ({
          id: socio.id,
          etiqueta: `${socio.nombre} - DNI: ${socio.dni}`,
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.socios = [];
        this.cdr.detectChanges();
      },
    });
  }

  listarComprobantes(): void {
    this.cargandoComprobantes = true;
    this.errorComprobantes = '';

    this.http.get<Comprobante[]>(this.comprobanteUrl).subscribe({
      next: (response) => {
        this.comprobantes = response.map((comprobante) =>
          new Comprobante(
            comprobante.id,
            comprobante.numero,
            comprobante.tipo,
            comprobante.fecha,
            comprobante.total,
            comprobante.vuelto,
            comprobante.idPuesto,
            comprobante.idUsuario ?? null,
            (comprobante.listaDetalle ?? []).map(
              (detalle: any) =>
                new DetalleComprobante(
                  detalle.id,
                  detalle.idDeuda,
                  detalle.montoPagado,
                  detalle.fechaRegistro,
                )
            ),
            false,
            comprobante.estado
          )
        );
        this.paginaActual = 1;
        this.actualizarMontoAcumulado();
        this.cargandoComprobantes = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorComprobantes = 'No se pudo cargar la lista de comprobantes.';
        this.cargandoComprobantes = false;
        this.cdr.detectChanges();
      },
    });
  }

  get comprobantesFiltrados(): Comprobante[] {
    const termino = this.filtroBusqueda.trim().toLowerCase();
    if (!termino) return this.comprobantes;

    return this.comprobantes.filter((comprobante) => {
      const fechaTexto = comprobante.fecha?.toLowerCase?.() ?? '';
      const numeroTexto = comprobante.numero?.toLowerCase?.() ?? '';
      const tipoTexto = comprobante.tipo?.toLowerCase?.() ?? '';
      const puestoTexto = String(comprobante.idPuesto ?? '').toLowerCase();
      const totalTexto = String(comprobante.total ?? '').toLowerCase();

      return (
        fechaTexto.includes(termino) ||
        numeroTexto.includes(termino) ||
        tipoTexto.includes(termino) ||
        puestoTexto.includes(termino) ||
        totalTexto.includes(termino)
      );
    });
  }

  get comprobantesPaginados(): Comprobante[] {
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

  actualizarMontoAcumulado(): void {
    this.montoAcumulado = this.comprobantes
      .filter((comprobante) => comprobante.seleccionado)
      .reduce((total, comprobante) => total + comprobante.total, 0);
  }

  guardarPago(): void {
    this.mostrarExitoGuardado = true;
  }

  cerrarMensajeExito(): void {
    this.mostrarExitoGuardado = false;
    this.router.navigate(['/pagos']);
  }

  volverAlListado(): void {
    this.router.navigate(['/pagos']);
  }
}
