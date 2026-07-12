"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ingresoSchema = z.object({
  fecha: z.string().min(1),
  negocio_id: z.string().uuid(),
  importe: z.coerce.number().positive(),
  observaciones: z.string().trim().optional(),
});

export async function crearIngreso(formData: FormData) {
  const parsed = ingresoSchema.parse({
    fecha: formData.get("fecha"),
    negocio_id: formData.get("negocio_id"),
    importe: formData.get("importe"),
    observaciones: formData.get("observaciones") || undefined,
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("ingresos").insert({
    ...parsed,
    observaciones: parsed.observaciones ?? null,
    created_by: user?.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/ingresos");
  revalidatePath("/dashboard");
}

export async function eliminarIngreso(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("ingresos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/ingresos");
  revalidatePath("/dashboard");
}
