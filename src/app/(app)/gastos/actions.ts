"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const gastoSchema = z.object({
  fecha: z.string().min(1),
  categoria: z.string().min(1),
  importe: z.coerce.number().positive(),
  observacion: z.string().trim().optional(),
  debo: z.coerce.boolean().optional(),
});

export async function crearGasto(formData: FormData) {
  const parsed = gastoSchema.parse({
    fecha: formData.get("fecha"),
    categoria: formData.get("categoria"),
    importe: formData.get("importe"),
    observacion: formData.get("observacion") || undefined,
    debo: formData.get("debo") === "on",
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("gastos").insert({
    ...parsed,
    observacion: parsed.observacion ?? null,
    debo: parsed.debo ?? false,
    created_by: user?.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/gastos");
  revalidatePath("/dashboard");
}

export async function actualizarGasto(id: string, formData: FormData) {
  const parsed = gastoSchema.parse({
    fecha: formData.get("fecha"),
    categoria: formData.get("categoria"),
    importe: formData.get("importe"),
    observacion: formData.get("observacion") || undefined,
    debo: formData.get("debo") === "on",
  });

  const supabase = await createClient();
  const { error } = await supabase
    .from("gastos")
    .update({ ...parsed, observacion: parsed.observacion ?? null, debo: parsed.debo ?? false })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/gastos");
  revalidatePath("/dashboard");
}

export async function eliminarGasto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("gastos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/gastos");
  revalidatePath("/dashboard");
}

export async function toggleGastoDebo(id: string, debo: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("gastos").update({ debo }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/gastos");
}
