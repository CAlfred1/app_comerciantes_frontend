import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { ComprobanteService } from '../../services/comprobante';
import { Comprobante } from '../../models/comprobante';

@Component({
  selector: 'app-comprobantes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class ListComponent implements OnInit {

  private comprobanteService = inject(ComprobanteService);
  private cdr = inject(ChangeDetectorRef);

  comprobantes: Comprobante[] = [];
  loading = false;

  filtro = '';

  ngOnInit(): void {
    this.listarComprobantes();
  }

  listarComprobantes(): void {

    this.loading = true;

    this.comprobanteService.listar().subscribe({
      next: (data) => {
        this.comprobantes = data;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.loading = false;

        Swal.fire(
          'Error',
          'No se pudieron cargar los comprobantes',
          'error'
        );

        this.cdr.detectChanges();
      }
    });
  }

    get comprobantesFiltrados(): Comprobante[] {

    const texto = this.filtro.toLowerCase().trim();

    if (!texto) return this.comprobantes;

    return this.comprobantes.filter(x =>
      x.numero?.toLowerCase().includes(texto) ||
      x.tipo?.toLowerCase().includes(texto)
    );
  }


  limpiar(): void {
    this.filtro = '';
  }

}