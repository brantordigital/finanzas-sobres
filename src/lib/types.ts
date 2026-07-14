export type Negocio = {
  id: string;
  nombre: string;
  activo: boolean;
  created_at: string;
};

export type Socio = {
  id: string;
  nombre: string;
  activo: boolean;
  created_at: string;
};

export type Distribucion = {
  id: string;
  categoria: string;
  porcentaje: number;
  orden: number;
  updated_at: string;
};

export type Ingreso = {
  id: string;
  fecha: string;
  negocio_id: string;
  importe: number;
  concepto: string | null;
  observaciones: string | null;
  created_by: string | null;
  created_at: string;
  negocios?: Pick<Negocio, "id" | "nombre">;
};

export type Gasto = {
  id: string;
  fecha: string;
  categoria: string;
  importe: number;
  concepto: string | null;
  observacion: string | null;
  debo: boolean;
  created_by: string | null;
  created_at: string;
};

export type CreditoSocio = {
  id: string;
  fecha: string;
  de_socio_id: string;
  para_socio_id: string;
  ingreso: number;
  egreso: number;
  fecha_solucionado: string | null;
  observaciones: string | null;
  created_by: string | null;
  created_at: string;
  de_socio?: Pick<Socio, "id" | "nombre">;
  para_socio?: Pick<Socio, "id" | "nombre">;
};

export type PrestamoSocio = {
  id: string;
  fecha: string;
  socio_id: string;
  egreso: number;
  ingreso: number;
  observaciones: string | null;
  created_by: string | null;
  created_at: string;
  socios?: Pick<Socio, "id" | "nombre">;
};
