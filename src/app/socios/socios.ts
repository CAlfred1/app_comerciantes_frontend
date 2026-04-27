import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface SocioResponse {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  estado: boolean;
}

interface SocioRequest {
  nombre: string;
  dni: string;
  telefono: string;
}

@Component({
  selector: 'app-socios',
  imports: [FormsModule],
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class SociosComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly baseUrl = 'http://localhost:9090/api/socios';

  socios: SocioResponse[] = [];
  cargando = false;
  enviando = false;
  error = '';
  exito = '';

  mostrarFormulario = false;
  mostrarConfirmarEliminar = false;
  socioAEliminarId: number | null = null;
  editando = false;
  socioEditandoId: number | null = null;

  form: SocioRequest = { nombre: '', dni: '', telefono: '' };

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.cargando = true;
    this.http.get<SocioResponse[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.socios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) this.socios = [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirFormularioNuevo(): void {
    this.editando = false;
    this.socioEditandoId = null;
    this.form = { nombre: '', dni: '', telefono: '' };
    this.error = '';
    this.exito = '';
    this.enviando = false;
    this.mostrarFormulario = true;
  }

  abrirFormularioEditar(socio: SocioResponse): void {
    this.editando = true;
    this.socioEditandoId = socio.id;
    this.form = { nombre: socio.nombre, dni: socio.dni, telefono: socio.telefono };
    this.error = '';
    this.exito = '';
    this.enviando = false;
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.enviando = false;
  }

  abrirConfirmarEliminar(id: number): void {
    this.error = '';
    this.exito = '';
    this.socioAEliminarId = id;
    this.mostrarConfirmarEliminar = true;
  }

  cerrarConfirmarEliminar(): void {
    this.mostrarConfirmarEliminar = false;
    this.socioAEliminarId = null;
    this.enviando = false;
  }

  confirmarEliminar(): void {
    if (this.socioAEliminarId === null || this.enviando) return;
    this.enviando = true;
    this.http.delete(`${this.baseUrl}/${this.socioAEliminarId}`, { responseType: 'text' }).subscribe({
      next: () => {
        this.enviando = false;
        this.mostrarConfirmarEliminar = false;
        this.socioAEliminarId = null;
        this.exito = 'Socio eliminado correctamente.';
        this.cdr.detectChanges();
        this.listar();
      },
      error: () => {
        this.enviando = false;
        this.mostrarConfirmarEliminar = false;
        this.socioAEliminarId = null;
        this.error = 'No se pudo eliminar el socio.';
        this.cdr.detectChanges();
      },
    });
  }

  guardar(): void {
    if (this.enviando) return;
    this.enviando = true;
    this.error = '';
    this.exito = '';

    if (this.editando && this.socioEditandoId !== null) {
      this.http.put<SocioResponse>(`${this.baseUrl}/${this.socioEditandoId}`, this.form).subscribe({
        next: () => {
          this.enviando = false;
          this.mostrarFormulario = false;
          this.exito = 'Socio actualizado correctamente.';
          this.cdr.detectChanges();
          this.listar();
        },
        error: () => {
          this.enviando = false;
          this.error = 'No se pudo actualizar el socio.';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.http.post<SocioResponse>(`${this.baseUrl}/registrar`, this.form).subscribe({
        next: () => {
          this.enviando = false;
          this.mostrarFormulario = false;
          this.exito = 'Socio registrado correctamente.';
          this.cdr.detectChanges();
          this.listar();
        },
        error: () => {
          this.enviando = false;
          this.error = 'No se pudo registrar el socio.';
          this.cdr.detectChanges();
        },
      });
    }
  }
}
