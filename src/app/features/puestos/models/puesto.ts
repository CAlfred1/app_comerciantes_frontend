export interface SocioOption {
id: number;
nombre: string;
}

export interface Puesto {
id: number;
codigo: string;
descripcion: string;
estado: boolean;
esPropiedad: boolean;
socio: SocioOption | null;
}

export interface PuestoRequest {
codigo: string;
descripcion: string;
esPropiedad: boolean;
idSocio: number | null;
}
