import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

interface SocioOption {
  id: number;
  nombre: string;
}

interface PuestoResponse {
  id: number;
  codigo: string;
  descripcion: string;
  estado: boolean;
  esPropiedad: boolean;
  socio: SocioOption | null;
}

interface PuestoRequest {
  codigo: string;
  descripcion: string;
  esPropiedad: boolean;
  idSocio: number | null;
}

@Component({
  selector: 'app-puestos',
  imports: [FormsModule, NgSelectComponent],
  templateUrl: './puestos.html',
  styleUrl: './puestos.css',
})
export class PuestosComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly baseUrl = 'http://localhost:9090/api/puestos';
  private readonly sociosUrl = 'http://localhost:9090/api/socios';

  puestos: PuestoResponse[] = [];
  socios: SocioOption[] = [];
  cargando = false;
  enviando = false;
  error = '';
  exito = '';

  mostrarFormulario = false;
  mostrarConfirmarEliminar = false;
  puestoAEliminarId: number | null = null;
  editando = false;
  puestoEditandoId: number | null = null;

  form: PuestoRequest = { codigo: '', descripcion: '', esPropiedad: false, idSocio: null };

  ngOnInit(): void {
    this.listar();
    this.cargarSocios();
  }

  listar(): void {
    this.cargando = true;
    this.http.get<PuestoResponse[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.puestos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) this.puestos = [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarSocios(): void {
    this.http.get<SocioOption[]>(this.sociosUrl).subscribe({
      next: (data) => {
        this.socios = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.socios = [];
        this.cdr.detectChanges();
      },
    });
  }

  abrirFormularioNuevo(): void {
    this.editando = false;
    this.puestoEditandoId = null;
    this.form = { codigo: '', descripcion: '', esPropiedad: false, idSocio: null };
    this.error = '';
    this.exito = '';
    this.enviando = false;
    this.cargarSocios();
    this.mostrarFormulario = true;
  }

  abrirFormularioEditar(puesto: PuestoResponse): void {
    this.editando = true;
    this.puestoEditandoId = puesto.id;
    this.form = {
      codigo: puesto.codigo,
      descripcion: puesto.descripcion,
      esPropiedad: puesto.esPropiedad,
      idSocio: puesto.socio?.id ?? null,
    };
    this.error = '';
    this.exito = '';
    this.enviando = false;
    this.cargarSocios();
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.enviando = false;
  }

  abrirConfirmarEliminar(id: number): void {
    this.error = '';
    this.exito = '';
    this.puestoAEliminarId = id;
    this.mostrarConfirmarEliminar = true;
  }

  cerrarConfirmarEliminar(): void {
    this.mostrarConfirmarEliminar = false;
    this.puestoAEliminarId = null;
    this.enviando = false;
  }

  confirmarEliminar(): void {
    if (this.puestoAEliminarId === null || this.enviando) return;
    this.enviando = true;
    this.http.delete(`${this.baseUrl}/${this.puestoAEliminarId}`, { responseType: 'text' }).subscribe({
      next: () => {
        this.enviando = false;
        this.mostrarConfirmarEliminar = false;
        this.puestoAEliminarId = null;
        this.exito = 'Puesto eliminado correctamente.';
        this.cdr.detectChanges();
        this.listar();
      },
      error: () => {
        this.enviando = false;
        this.mostrarConfirmarEliminar = false;
        this.puestoAEliminarId = null;
        this.error = 'No se pudo eliminar el puesto.';
        this.cdr.detectChanges();
      },
    });
  }

  guardar(): void {
    if (this.enviando) return;
    this.enviando = true;
    this.error = '';
    this.exito = '';

    if (this.editando && this.puestoEditandoId !== null) {
      this.http.put<PuestoResponse>(`${this.baseUrl}/${this.puestoEditandoId}`, this.form).subscribe({
        next: () => {
          this.enviando = false;
          this.mostrarFormulario = false;
          this.exito = 'Puesto actualizado correctamente.';
          this.cdr.detectChanges();
          this.listar();
        },
        error: () => {
          this.enviando = false;
          this.error = 'No se pudo actualizar el puesto.';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.http.post<PuestoResponse>(`${this.baseUrl}/registrar`, this.form).subscribe({
        next: () => {
          this.enviando = false;
          this.mostrarFormulario = false;
          this.exito = 'Puesto registrado correctamente.';
          this.cdr.detectChanges();
          this.listar();
        },
        error: () => {
          this.enviando = false;
          this.error = 'No se pudo registrar el puesto.';
          this.cdr.detectChanges();
        },
      });
    }
  }
}
