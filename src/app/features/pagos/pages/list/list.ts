import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PagoService } from '../../services/pago';
import { Pago } from '../../models/pago';

@Component({
  selector: 'app-pagos-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class ListComponent implements OnInit {

  private pagoService = inject(PagoService);
  private cdr = inject(ChangeDetectorRef);

  pagos: Pago[] = [];
  loading = false;

  // NUEVO
  searchTerm = '';
  pageSize = 5;
  currentPage = 1;

  ngOnInit(): void {
    this.listarPagos();
  }

  listarPagos(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.pagoService.listar().subscribe({
      next: (data: Pago[]) => {
        this.pagos = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al listar pagos:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // FILTRADOS
  get pagosFiltrados(): Pago[] {
  const texto = this.searchTerm.trim().toLowerCase();

  return this.pagos.filter(p => {

    const id = p.id ?? '';
    const metodo = p.metodo?.toLowerCase() ?? '';
    const fecha = p.fechaRegistro?.toLowerCase() ?? '';

    // Si escribe número -> busca ID
    if (!isNaN(Number(texto))) {
      return String(id).includes(texto);
    }

    // Si escribe texto -> método o fecha
    return (
      metodo.includes(texto) ||
      fecha.includes(texto)
      );
    });
  }

  // PAGINADOS
  get pagosPaginados(): Pago[] {
    const inicio = (this.currentPage - 1) * this.pageSize;
    const fin = inicio + this.pageSize;

    return this.pagosFiltrados.slice(inicio, fin);
  }

  get totalPages(): number {
    return Math.ceil(
      this.pagosFiltrados.length / this.pageSize
    );
  }

  siguiente(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  anterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  limpiar(): void {
    this.searchTerm = '';
    this.currentPage = 1;
  }
}