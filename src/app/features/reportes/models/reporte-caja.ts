export interface DetalleComprobanteDto {
  id: number;
  comprobante: null;
  idDeuda: number;
  montoPagado: number;
  fechaRegistro: string;
}

export interface ComprobanteDto {
  fecha: string;
  id: number;
  idPuesto: number;
  idUsuario: number;
  listaDetalle: DetalleComprobanteDto[];
  numero: string;
  tipo: string;
  total: number;
  vuelto: number;
}

export interface ReporteCajaDto {
  cantidadComprobantes: number;
  comprobantes: ComprobanteDto[];
  totalGeneral: number;
  totalPorMetodoPago: Record<string, number>;
}