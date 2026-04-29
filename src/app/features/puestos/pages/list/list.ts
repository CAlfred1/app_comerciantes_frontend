import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Puesto,
  PuestoRequest,
  SocioOption
} from '../../models/puesto';

import { PuestosService } from '../../services/puestos';

@Component({
  selector: 'app-puestos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.html'
})
export class ListComponent implements OnInit {

  private service = inject(PuestosService);
  private cdr = inject(ChangeDetectorRef);

  puestos: Puesto[] = [];
  socios: SocioOption[] = [];

  mostrarModal = false;
  editando = false;
  puestoId = 0;

  form: PuestoRequest = {
    codigo: '',
    descripcion: '',
    esPropiedad: false,
    idSocio: null
  };

  ngOnInit(): void {
    this.cargar();
    this.cargarSocios();
  }

  cargar() {
    this.service.listar().subscribe(resp => {
      this.puestos = resp;
      this.cdr.detectChanges();
    });
  }

  cargarSocios() {
    this.service.listarSocios().subscribe(resp => {
      this.socios = resp;
      this.cdr.detectChanges();
    });
  }

  nuevo() {
    this.editando = false;

    this.form = {
      codigo: '',
      descripcion: '',
      esPropiedad: false,
      idSocio: null
    };

    this.mostrarModal = true;
  }

  editar(item: Puesto) {
    this.editando = true;
    this.puestoId = item.id;

    this.form = {
      codigo: item.codigo,
      descripcion: item.descripcion,
      esPropiedad: item.esPropiedad,
      idSocio: item.socio?.id ?? null
    };

    this.mostrarModal = true;
  }

  guardar() {
    const peticion = this.editando
      ? this.service.actualizar(this.puestoId, this.form)
      : this.service.registrar(this.form);

    peticion.subscribe(() => {
      this.cerrar();
      this.cargar();
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar puesto?')) return;

    this.service.eliminar(id)
      .subscribe(() => this.cargar());
  }

  cerrar() {
    this.mostrarModal = false;
  }
}