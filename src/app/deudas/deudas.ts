import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

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
  esPropiedadAsociacion?: boolean;
  esPropiedad?: boolean;
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

interface SocioOption {
  id: number;
  etiqueta: string;
}

interface PuestoOption {
  id: number;
  etiqueta: string;
}

interface MotivoOption {
  id: number;
  descripcion: string;
}

interface LoteOption {
  id: number;
  descripcion: string;
  fecha: string;
  etiqueta: string;
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
  imports: [FormsModule, NgSelectComponent],
  templateUrl: './deudas.html',
  styleUrl: './deudas.css',
})
export class DeudasComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly baseUrl = 'http://localhost:9090/deudas';
  private readonly sociosUrl = 'http://localhost:9090/socios';
  private readonly puestosUrl = 'http://localhost:9090/api/puestos';
  private readonly motivosUrl = 'http://localhost:9090/motivos';
  private readonly lotesUrl = 'http://localhost:9090/lotes';

  deudas: DeudaResponse[] = [];
  filtroBusqueda = '';
  tamanosPagina = [5, 10, 20];
  tamanoPagina = 5;
  paginaActual = 1;
  sociosOpciones: SocioOption[] = [];
  puestosOpciones: PuestoOption[] = [];
  motivosOpciones: MotivoOption[] = [];
  lotesOpciones: LoteOption[] = [];
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
    this.cargarCatalogos();
    this.listar();
  }

  listar(): void {
    this.cargando = true;
    this.http.get<DeudaResponse[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.deudas = data;
        this.actualizarCatalogosDesdeDeudas(data);
        this.paginaActual = 1;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.deudas = [];
        } else {
          this.error = 'No se pudo cargar la lista de deudas.';
        }
        this.paginaActual = 1;
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get deudasFiltradas(): DeudaResponse[] {
    const termino = this.filtroBusqueda.trim().toLowerCase();
    if (!termino) return this.deudas;

    return this.deudas.filter((deuda) => {
      const socioTexto = deuda.socio.nombre.toLowerCase();
      const puestoTexto = `${deuda.puesto.codigo} ${deuda.puesto.descripcion}`.toLowerCase();
      return socioTexto.includes(termino) || puestoTexto.includes(termino);
    });
  }

  get deudasPaginadas(): DeudaResponse[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.deudasFiltradas.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    const total = Math.ceil(this.deudasFiltradas.length / this.tamanoPagina);
    return total > 0 ? total : 1;
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
  }

  cambiarTamanoPagina(): void {
    this.paginaActual = 1;
  }

  limpiarFiltro(): void {
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

  abrirFormularioNuevo(): void {
    this.editando = false;
    this.deudaEditandoId = null;
    this.form = this.getFormInicial();
    this.cargarCatalogos();
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
        this.asegurarOpcionesDesdeDeuda(deuda);
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

  private cargarCatalogos(): void {
    this.cargarSocios();
    this.cargarPuestos();
    this.cargarMotivos();
    this.cargarLotes();
  }

  private cargarSocios(): void {
    this.http.get<SocioResumen[]>(this.sociosUrl).subscribe({
      next: (data) => {
        this.sociosOpciones = data.map((socio) => ({
          id: socio.id,
          etiqueta: `${socio.nombre} - DNI: ${socio.dni}`,
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.sociosOpciones = [];
        this.cdr.detectChanges();
      },
    });
  }

  private cargarPuestos(): void {
    this.http.get<PuestoResumen[]>(this.puestosUrl).subscribe({
      next: (data) => {
        this.puestosOpciones = data.map((puesto) => ({
          id: puesto.id,
          etiqueta: `${puesto.codigo} - ${puesto.descripcion}`,
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.puestosOpciones = [];
        this.cdr.detectChanges();
      },
    });
  }

  private cargarMotivos(): void {
    this.http.get<MotivoResumen[]>(this.motivosUrl).subscribe({
      next: (data) => {
        this.motivosOpciones = data.map((motivo) => ({
          id: motivo.id,
          descripcion: motivo.descripcion,
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  private cargarLotes(): void {
    this.http.get<LoteResumen[]>(this.lotesUrl).subscribe({
      next: (data) => {
        this.lotesOpciones = data.map((lote) => ({
          id: lote.id,
          descripcion: lote.descripcion,
          fecha: lote.fecha,
          etiqueta: `${lote.descripcion} - ${lote.fecha}`,
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  private actualizarCatalogosDesdeDeudas(data: DeudaResponse[]): void {
    const motivosMap = new Map<number, MotivoOption>();
    const lotesMap = new Map<number, LoteOption>();

    for (const deuda of data) {
      this.agregarSocioSiNoExiste(deuda.socio);
      this.agregarPuestoSiNoExiste(deuda.puesto);

      motivosMap.set(deuda.motivo.id, {
        id: deuda.motivo.id,
        descripcion: deuda.motivo.descripcion,
      });

      if (deuda.lote) {
        lotesMap.set(deuda.lote.id, {
          id: deuda.lote.id,
          descripcion: deuda.lote.descripcion,
          fecha: deuda.lote.fecha,
          etiqueta: `${deuda.lote.descripcion} - ${deuda.lote.fecha}`,
        });
      }
    }

    this.motivosOpciones = [...motivosMap.values()];
    this.lotesOpciones = [...lotesMap.values()];
  }

  private asegurarOpcionesDesdeDeuda(deuda: DeudaResponse): void {
    this.agregarSocioSiNoExiste(deuda.socio);
    this.agregarPuestoSiNoExiste(deuda.puesto);

    if (!this.motivosOpciones.some((item) => item.id === deuda.motivo.id)) {
      this.motivosOpciones = [
        ...this.motivosOpciones,
        { id: deuda.motivo.id, descripcion: deuda.motivo.descripcion },
      ];
    }

    if (deuda.lote && !this.lotesOpciones.some((item) => item.id === deuda.lote?.id)) {
      this.lotesOpciones = [
        ...this.lotesOpciones,
        {
          id: deuda.lote.id,
          descripcion: deuda.lote.descripcion,
          fecha: deuda.lote.fecha,
          etiqueta: `${deuda.lote.descripcion} - ${deuda.lote.fecha}`,
        },
      ];
    }
  }

  private agregarSocioSiNoExiste(socio: SocioResumen): void {
    if (this.sociosOpciones.some((item) => item.id === socio.id)) return;
    this.sociosOpciones = [
      ...this.sociosOpciones,
      { id: socio.id, etiqueta: `${socio.nombre} - DNI: ${socio.dni}` },
    ];
  }

  private agregarPuestoSiNoExiste(puesto: PuestoResumen): void {
    if (this.puestosOpciones.some((item) => item.id === puesto.id)) return;
    this.puestosOpciones = [
      ...this.puestosOpciones,
      { id: puesto.id, etiqueta: `${puesto.codigo} - ${puesto.descripcion}` },
    ];
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
