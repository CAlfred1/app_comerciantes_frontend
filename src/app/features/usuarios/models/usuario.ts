export interface Rol {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  username: string;
  password?: string;
  estado: boolean;
  roles: Rol[];
}

export interface UsuarioRequest {
  username: string;
  password: string;
  idRol: number;
}