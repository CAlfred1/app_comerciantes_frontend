import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MotivoCobroService } from '../../services/motivo-cobro';
import { MotivoCobro } from '../../models/motivo-cobro';

@Component({
  selector: 'app-motivos-cobro-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class ListComponent implements OnInit {

  private motivoCobroService = inject(MotivoCobroService);
  private cdr = inject(ChangeDetectorRef);

  motivos: MotivoCobro[] = [];
  loading = false;

  ngOnInit(): void {
    this.listarMotivos();
  }

  listarMotivos(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.motivoCobroService.listar().subscribe({
      next: (data: MotivoCobro[]) => {
        this.motivos = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(
          'Error al listar motivos de cobro:',
          error
        );

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}