import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { MotivoCobroService } from '../../services/motivo-cobro';

@Component({
  selector: 'app-motivo-cobro-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create.html',
  styleUrl: './create.css'
})
export class CreateComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private motivoCobroService = inject(MotivoCobroService);

  form = this.fb.group({
    descripcion: ['', Validators.required]
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.motivoCobroService.registrar(this.form.value as any).subscribe({
      next: () => {
        Swal.fire(
          'Registrado',
          'Motivo de cobro registrado correctamente',
          'success'
        );

        this.router.navigate(['/motivos-cobro']);
      },
      error: () => {
        Swal.fire(
          'Error',
          'No se pudo registrar el motivo de cobro',
          'error'
        );
      }
    });
  }
}