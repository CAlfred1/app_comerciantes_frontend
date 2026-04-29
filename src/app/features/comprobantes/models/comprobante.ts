export interface Comprobante {
  id?: number;
  numero: string;
  fecha: string;
  tipo: string;
  total: number;
  vuelto: number;
  idPuesto: number;
  idUsuario: number;
  listaDetalle: any[];
}