export interface PagoDetalle {
  id?: number;
  idComprobante?: number;
  comprobante?: any;
  pago?: any;
}

export interface Pago {
  id?: number;
  metodo: string;
  montoAcumulado: number;
  fechaRegistro?: string;
  detalles: PagoDetalle[];
}