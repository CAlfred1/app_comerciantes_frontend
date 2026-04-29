import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { ComprobanteService } from '../../services/comprobante';

@Component({
  selector: 'app-comprobante-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create.html',
  styleUrl: './create.css'
})
export class CreateComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(ComprobanteService);

  editando = false;
  id: number | null = null;

  form = this.fb.group({
    numero: ['', Validators.required],
    fecha: ['', Validators.required],
    tipo: ['', Validators.required],
    total: [0, Validators.required],
    vuelto: [0, Validators.required],
    idPuesto: [1, Validators.required],
    idUsuario: [1, Validators.required]
  });

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.editando = true;
      this.cargarComprobante(this.id);
    }
  }

  cargarComprobante(id: number): void {

    this.service.obtenerPorId(id).subscribe({
      next: (data) => {

        this.form.patchValue({
          numero: data.numero,
          fecha: data.fecha?.substring(0,16),
          tipo: data.tipo,
          total: data.total,
          vuelto: data.vuelto,
          idPuesto: data.idPuesto,
          idUsuario: data.idUsuario
        });

      }
    });
  }

  guardar(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const comprobante = {
      ...this.form.value,
      listaDetalle: []
    };

    if (this.editando && this.id) {

      this.service.actualizar(this.id, comprobante as any)
        .subscribe({
          next: () => {
            Swal.fire('Actualizado', 'Comprobante actualizado', 'success');
            this.router.navigate(['/comprobantes']);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar', 'error');
          }
        });

    } else {

      this.service.registrar(comprobante as any)
        .subscribe({
          next: () => {
            Swal.fire('Registrado', 'Comprobante guardado', 'success');
            this.router.navigate(['/comprobantes']);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo registrar', 'error');
          }
        });

    }
  }
}