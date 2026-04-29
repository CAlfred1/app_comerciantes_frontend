import {
  Component,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReporteCajaService } from '../../services/reporte-caja';
import { ReporteCajaDto } from '../../models/reporte-caja';

@Component({
  selector: 'app-reporte-caja',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reporte-caja.html',
  styleUrls: ['./reporte-caja.css']
})
export class ReporteCajaComponent {

  private service = inject(ReporteCajaService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  reporte?: ReporteCajaDto;

  fechaInicio = '';
  fechaFin = '';

  anio = new Date().getFullYear();
  mes = new Date().getMonth() + 1;

  consultarRango(): void {
    this.loading = true;

    this.service
      .porRango(this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (data) => {
          this.reporte = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  consultarMensual(): void {
    this.loading = true;

    this.service
      .porMes(this.anio, this.mes)
      .subscribe({
        next: (data) => {
          this.reporte = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  descargar(blob: Blob, nombre: string): void {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  pdfRango(): void {
    this.service
      .pdfRango(this.fechaInicio, this.fechaFin)
      .subscribe(blob => {
        this.descargar(blob, 'reporte_caja.pdf');
      });
  }

  pdfMensual(): void {
    this.service
      .pdfMensual(this.anio, this.mes)
      .subscribe(blob => {
        this.descargar(blob, 'reporte_mensual.pdf');
      });
  }
}