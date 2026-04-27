import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

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
  ) {}
}

@Component({
  selector: 'app-pagos',
  imports: [DatePipe, FormsModule, NgSelectComponent],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export class PagosComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly comprobanteUrl = 'http://localhost:9090/comprobante/listar';

  clienteSeleccionado: number | null = null;
  fechaPago: string = new Date().toISOString().split('T')[0];
  montoAcumulado: number = 0;
  metodoPagoSeleccionado: number | null = null;
  mostrarExitoGuardado: boolean = false;
  cargandoComprobantes: boolean = false;
  errorComprobantes = '';

  metodosPago = [
    { id: 1, nombre: 'Efectivo' },
    { id: 2, nombre: 'Yape' },
    { id: 3, nombre: 'Transferencia' },
    { id: 4, nombre: 'Tarjeta' }
  ];
  clientes = [
    { id: 1, nombre: 'Juan Perez' },
    { id: 2, nombre: 'Maria Lopez' },
    { id: 3, nombre: 'Carlos Ruiz' },
    { id: 4, nombre: 'Ana Torres' },
  ];

  comprobantes: Comprobante[] = [];

  ngOnInit(): void {
    this.listarComprobantes();
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
          )
        );
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
  }
}
