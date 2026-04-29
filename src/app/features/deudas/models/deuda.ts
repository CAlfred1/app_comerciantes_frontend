export type EstadoDeuda = 'PENDIENTE' | 'PAGADA';

export interface Deuda {
  id: number;
  socio: any;
  puesto: any;
  motivo: any;
  lote: any | null;
  monto: number;
  fecha: string;
  estado: EstadoDeuda;
  fechaPago: string | null;
  fechaCreacion: string;
}

export interface DeudaRequest {
  idSocio: number | null;
  idPuesto: number | null;
  idMotivo: number | null;
  monto: number | null;
  fecha: string;
  estado: EstadoDeuda;
  fechaPago: string | null;
}