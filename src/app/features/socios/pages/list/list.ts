import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Socio, SocioRequest } from '../../models/socio';
import { SociosService } from '../../services/socios';

@Component({
  selector: 'app-socios-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.html'
})
export class ListComponent implements OnInit {

  private service = inject(SociosService);
  private cdr = inject(ChangeDetectorRef);

  socios: Socio[] = [];

  mostrarModal = false;
  editando = false;
  socioId = 0;

  form: SocioRequest = {
    nombre: '',
    dni: '',
    telefono: ''
  };

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.service.listar().subscribe({
      next: resp => {
        this.socios = resp;
        this.cdr.detectChanges();
      }
    });
  }

  nuevo() {
    this.editando = false;
    this.form = { nombre: '', dni: '', telefono: '' };
    this.mostrarModal = true;
  }

  editar(item: Socio) {
    this.editando = true;
    this.socioId = item.id;

    this.form = {
      nombre: item.nombre,
      dni: item.dni,
      telefono: item.telefono
    };

    this.mostrarModal = true;
  }

  guardar() {
    const peticion = this.editando
      ? this.service.actualizar(this.socioId, this.form)
      : this.service.registrar(this.form);

    peticion.subscribe(() => {
      this.cerrar();
      this.cargar();
    });
  }


  cerrar() {
    this.mostrarModal = false;
  }
}