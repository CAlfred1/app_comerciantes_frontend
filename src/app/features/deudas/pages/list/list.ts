import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Deuda, DeudaRequest } from '../../models/deuda';
import { DeudasService } from '../../services/deudas';

import { SociosService } from '../../../socios/services/socios';
import { PuestosService } from '../../../puestos/services/puestos';
import { MotivoCobroService } from '../../../motivos-cobro/services/motivo-cobro';

@Component({
  selector: 'app-deudas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.html'
})
export class ListComponent implements OnInit {

  private service = inject(DeudasService);
  private sociosService = inject(SociosService);
  private puestosService = inject(PuestosService);
  private motivosService = inject(MotivoCobroService);
  private cdr = inject(ChangeDetectorRef);

  deudas: Deuda[] = [];

  socios: any[] = [];
  puestos: any[] = [];
  motivos: any[] = [];

  mostrarModal = false;
  editando = false;
  deudaId = 0;

  form: DeudaRequest = {
    idSocio: null,
    idPuesto: null,
    idMotivo: null,
    monto: null,
    fecha: '',
    estado: 'PENDIENTE',
    fechaPago: null
  };

  ngOnInit(): void {
    this.cargar();
    this.cargarCatalogos();
  }

  cargar() {
    this.service.listar().subscribe({
      next: resp => {
        this.deudas = resp;
        this.cdr.detectChanges();
      }
    });
  }

  cargarCatalogos() {
    this.sociosService.listar().subscribe(r => this.socios = r);
    this.puestosService.listar().subscribe(r => this.puestos = r);
    this.motivosService.listar().subscribe(r => this.motivos = r);
  }

  nuevo() {
    this.editando = false;

    this.form = {
      idSocio: null,
      idPuesto: null,
      idMotivo: null,
      monto: null,
      fecha: '',
      estado: 'PENDIENTE',
      fechaPago: null
    };

    this.mostrarModal = true;
  }

  editar(item: Deuda) {
    if (item.estado === 'PAGADA') return;

    this.editando = true;
    this.deudaId = item.id;

    this.form = {
      idSocio: item.socio.id,
      idPuesto: item.puesto.id,
      idMotivo: item.motivo.id,
      monto: item.monto,
      fecha: item.fecha,
      estado: item.estado,
      fechaPago: item.fechaPago
    };

    this.mostrarModal = true;
  }

  guardar() {
    const peticion = this.editando
      ? this.service.actualizar(this.deudaId, this.form)
      : this.service.registrar(this.form);

    peticion.subscribe(() => {
      this.cerrar();
      this.cargar();
    });
  }

  eliminar(id: number, estado: string) {
    if (estado === 'PAGADA') return;
    if (!confirm('¿Eliminar deuda?')) return;

    this.service.eliminar(id)
      .subscribe(() => this.cargar());
  }

  cerrar() {
    this.mostrarModal = false;
  }
}