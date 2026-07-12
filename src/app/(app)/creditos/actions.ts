"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const creditoSchema = z
  .object({
    fecha: z.string().min(1),
    de_socio_id: z.string().uuid(),
    para_socio_id: z.string().uuid(),
    ingreso: z.coerce.number().min(0).default(0),
    egreso: z.coerce.number().min(0).default(0),
    fecha_solucionado: z.string().optional(),
    observaciones: z.string().trim().optional(),
  })
  .refine((data) => data.de_socio_id !== data.para_socio_id, {
    message: "El socio de origen y destino no pueden ser el mismo",
    path: ["para_socio_id"],
  });

export async function crearCredito(formData: FormData) {
  const parsed = creditoSchema.parse({
    fecha: formData.get("fecha"),
    de_socio_id: formData.get("de_socio_id"),
    para_socio_id: formData.get("para_socio_id"),
    ingreso: formData.get("ingreso") || 0,
    egreso: formData.get("egreso") || 0,
    fecha_solucionado: formData.get("fecha_solucionado") || undefined,
    observaciones: formData.get("observaciones") || undefined,
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("creditos_socios").insert({
    ...parsed,
    fecha_solucionado: parsed.fecha_solucionado || null,
    observaciones: parsed.observaciones ?? null,
    created_by: user?.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/creditos");
  revalidatePath("/dashboard");
}

export async function actualizarCredito(id: string, formData: FormData) {
  const parsed = creditoSchema.parse({
    fecha: formData.get("fecha"),
    de_socio_id: formData.get("de_socio_id"),
    para_socio_id: formData.get("para_socio_id"),
    ingreso: formData.get("ingreso") || 0,
    egreso: formData.get("egreso") || 0,
    fecha_solucionado: formData.get("fecha_solucionado") || undefined,
    observaciones: formData.get("observaciones") || undefined,
  });

  const supabase = await createClient();
  const { error } = await supabase
    .from("creditos_socios")
    .update({
      ...parsed,
      fecha_solucionado: parsed.fecha_solucionado || null,
      observaciones: parsed.observaciones ?? null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/creditos");
  revalidatePath("/dashboard");
}

export async function eliminarCredito(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("creditos_socios").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/creditos");
  revalidatePath("/dashboard");
}

export async function marcarCreditoSolucionado(id: string, fecha: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("creditos_socios")
    .update({ fecha_solucionado: fecha })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/creditos");
}
