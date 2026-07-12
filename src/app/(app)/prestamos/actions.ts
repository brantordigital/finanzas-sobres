"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const prestamoSchema = z.object({
  fecha: z.string().min(1),
  socio_id: z.string().uuid(),
  egreso: z.coerce.number().min(0).default(0),
  ingreso: z.coerce.number().min(0).default(0),
  observaciones: z.string().trim().optional(),
});

export async function crearPrestamo(formData: FormData) {
  const parsed = prestamoSchema.parse({
    fecha: formData.get("fecha"),
    socio_id: formData.get("socio_id"),
    egreso: formData.get("egreso") || 0,
    ingreso: formData.get("ingreso") || 0,
    observaciones: formData.get("observaciones") || undefined,
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("prestamos_socios").insert({
    ...parsed,
    observaciones: parsed.observaciones ?? null,
    created_by: user?.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/prestamos");
  revalidatePath("/dashboard");
}

export async function eliminarPrestamo(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("prestamos_socios").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/prestamos");
  revalidatePath("/dashboard");
}
