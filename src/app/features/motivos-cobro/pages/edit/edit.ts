import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import Swal from 'sweetalert2';

import { MotivoCobroService } from '../../services/motivo-cobro';

@Component({
  selector: 'app-motivo-cobro-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class EditComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private motivoCobroService = inject(MotivoCobroService);

  id!: number;

  form = this.fb.group({
    descripcion: ['', Validators.required]
  });

  ngOnInit(): void {
    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.cargarMotivo();
  }

  cargarMotivo(): void {
    this.motivoCobroService.obtenerPorId(this.id)
      .subscribe({
        next: (data) => {
          this.form.patchValue({
            descripcion: data.descripcion
          });
        },
        error: () => {
          Swal.fire(
            'Error',
            'No se pudo cargar el motivo',
            'error'
          );
        }
      });
  }

  actualizar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.motivoCobroService
      .actualizar(this.id, this.form.value as any)
      .subscribe({
        next: () => {
          Swal.fire(
            'Actualizado',
            'Motivo actualizado correctamente',
            'success'
          );

          this.router.navigate(['/motivos-cobro']);
        },
        error: () => {
          Swal.fire(
            'Error',
            'No se pudo actualizar',
            'error'
          );
        }
      });
  }
}