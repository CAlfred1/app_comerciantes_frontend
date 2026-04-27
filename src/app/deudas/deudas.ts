import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

type EstadoDeuda = 'PENDIENTE' | 'PAGADA';

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
  esPropiedadAsociacion: boolean;
}

interface MotivoResumen {
  id: number;
  descripcion: string;
}

interface LoteResumen {
  id: number;
  descripcion: string;
  fecha: string;
}

interface DeudaResponse {
  id: number;
  socio: SocioResumen;
  puesto: PuestoResumen;
  motivo: MotivoResumen;
  lote: LoteResumen | null;
  monto: number;
  fecha: string;
  estado: EstadoDeuda;
  fechaPago: string | null;
  fechaCreacion: string;
}

interface DeudaRequest {
  idSocio: number | null;
  idPuesto: number | null;
  idMotivo: number | null;
  idLote: number | null;
  monto: number | null;
  fecha: string;
  estado: EstadoDeuda | null;
  fechaPago: string | null;
}

@Component({
  selector: 'app-deudas',
  imports: [FormsModule],
  templateUrl: './deudas.html',
  styleUrl: './deudas.css',
})
export class DeudasComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly baseUrl = 'http://localhost:9090/deudas';

  deudas: DeudaResponse[] = [];
  cargando = false;
  enviando = false;
  error = '';
  exito = '';

  mostrarFormulario = false;
  mostrarConfirmarEliminar = false;
  deudaAEliminarId: number | null = null;
  editando = false;
  deudaEditandoId: number | null = null;

  estadosDeuda: EstadoDeuda[] = ['PENDIENTE', 'PAGADA'];
  form: DeudaRequest = this.getFormInicial();

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.cargando = true;
    this.http.get<DeudaResponse[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.deudas = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.deudas = [];
        } else {
          this.error = 'No se pudo cargar la lista de deudas.';
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirFormularioNuevo(): void {
    this.editando = false;
    this.deudaEditandoId = null;
    this.form = this.getFormInicial();
    this.error = '';
    this.exito = '';
    this.enviando = false;
    this.mostrarFormulario = true;
  }

  abrirFormularioEditar(id: number): void {
    if (this.enviando) return;

    this.enviando = true;
    this.error = '';
    this.exito = '';

    this.http.get<DeudaResponse>(`${this.baseUrl}/${id}`).subscribe({
      next: (deuda) => {
        this.editando = true;
        this.deudaEditandoId = deuda.id;
        this.form = {
          idSocio: deuda.socio.id,
          idPuesto: deuda.puesto.id,
          idMotivo: deuda.motivo.id,
          idLote: deuda.lote?.id ?? null,
          monto: deuda.monto,
          fecha: deuda.fecha,
          estado: deuda.estado,
          fechaPago: deuda.fechaPago,
        };
        this.enviando = false;
        this.mostrarFormulario = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.enviando = false;
        this.error = 'No se pudo obtener la deuda seleccionada.';
        this.cdr.detectChanges();
      },
    });
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.enviando = false;
  }

  abrirConfirmarEliminar(id: number): void {
    this.error = '';
    this.exito = '';
    this.deudaAEliminarId = id;
    this.mostrarConfirmarEliminar = true;
  }

  cerrarConfirmarEliminar(): void {
    this.mostrarConfirmarEliminar = false;
    this.deudaAEliminarId = null;
    this.enviando = false;
  }

  confirmarEliminar(): void {
    if (this.deudaAEliminarId === null || this.enviando) return;

    this.enviando = true;
    this.http.delete(`${this.baseUrl}/${this.deudaAEliminarId}`, { responseType: 'text' }).subscribe({
      next: () => {
        this.enviando = false;
        this.mostrarConfirmarEliminar = false;
        this.deudaAEliminarId = null;
        this.exito = 'Deuda eliminada correctamente.';
        this.cdr.detectChanges();
        this.listar();
      },
      error: () => {
        this.enviando = false;
        this.mostrarConfirmarEliminar = false;
        this.deudaAEliminarId = null;
        this.error = 'No se pudo eliminar la deuda.';
        this.cdr.detectChanges();
      },
    });
  }

  guardar(): void {
    if (this.enviando) return;

    if (!this.esFormularioValido()) {
      this.error = 'Completa los campos obligatorios: socio, puesto, motivo, monto y fecha.';
      return;
    }

    this.enviando = true;
    this.error = '';
    this.exito = '';

    const payload = {
      idSocio: this.form.idSocio as number,
      idPuesto: this.form.idPuesto as number,
      idMotivo: this.form.idMotivo as number,
      idLote: this.form.idLote,
      monto: this.form.monto as number,
      fecha: this.form.fecha,
      estado: this.form.estado ?? 'PENDIENTE',
      fechaPago: this.form.fechaPago && this.form.fechaPago.trim().length > 0 ? this.form.fechaPago : null,
    };

    if (this.editando && this.deudaEditandoId !== null) {
      this.http.put<DeudaResponse>(`${this.baseUrl}/${this.deudaEditandoId}`, payload).subscribe({
        next: () => {
          this.enviando = false;
          this.mostrarFormulario = false;
          this.exito = 'Deuda actualizada correctamente.';
          this.cdr.detectChanges();
          this.listar();
        },
        error: () => {
          this.enviando = false;
          this.error = 'No se pudo actualizar la deuda.';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.http.post<DeudaResponse>(this.baseUrl, payload).subscribe({
        next: () => {
          this.enviando = false;
          this.mostrarFormulario = false;
          this.exito = 'Deuda registrada correctamente.';
          this.cdr.detectChanges();
          this.listar();
        },
        error: () => {
          this.enviando = false;
          this.error = 'No se pudo registrar la deuda.';
          this.cdr.detectChanges();
        },
      });
    }
  }

  esDeudaPendiente(deuda: DeudaResponse): boolean {
    return deuda.estado === 'PENDIENTE';
  }

  private esFormularioValido(): boolean {
    return (
      this.form.idSocio !== null &&
      this.form.idPuesto !== null &&
      this.form.idMotivo !== null &&
      this.form.monto !== null &&
      this.form.monto > 0 &&
      this.form.fecha.trim().length > 0
    );
  }

  private getFormInicial(): DeudaRequest {
    return {
      idSocio: null,
      idPuesto: null,
      idMotivo: null,
      idLote: null,
      monto: null,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'PENDIENTE',
      fechaPago: null,
    };
  }
}
