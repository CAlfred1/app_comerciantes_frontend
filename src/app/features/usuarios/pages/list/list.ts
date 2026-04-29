import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Usuario
} from '../../models/usuario';

import { UsuariosService } from '../../services/usuarios';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.html'
})
export class ListComponent implements OnInit {

  private service = inject(UsuariosService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: Usuario[] = [];

  mostrarModal = false;
  editando = false;
  usuarioId = 0;

  form: any = {
    username: '',
    password: '',
    idRol: 2,
    estado: true
  };

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.service.listar().subscribe({
      next: resp => {
        this.usuarios = resp;
        this.cdr.detectChanges();
      }
    });
  }

  nuevo() {
    this.editando = false;

    this.form = {
      username: '',
      password: '',
      idRol: 2,
      estado: true
    };

    this.mostrarModal = true;
  }

  editar(item: Usuario) {
    this.editando = true;
    this.usuarioId = item.id;

    this.form = {
      username: item.username,
      password: '',
      idRol: item.roles[0]?.id,
      estado: item.estado
    };

    this.mostrarModal = true;
  }

  guardar() {

    if (this.editando) {

      this.service.actualizar(
        this.usuarioId,
        this.form
      ).subscribe(() => {
        this.cerrar();
        this.cargar();
      });

    } else {

      this.service.registrar(
        this.form
      ).subscribe(() => {
        this.cerrar();
        this.cargar();
      });

    }

  }

  cerrar() {
    this.mostrarModal = false;
  }

}