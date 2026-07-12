"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const negocioSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
});

export async function crearNegocio(formData: FormData) {
  const parsed = negocioSchema.parse({ nombre: formData.get("nombre") });
  const supabase = await createClient();
  const { error } = await supabase.from("negocios").insert(parsed);
  if (error) throw new Error(error.message);
  revalidatePath("/negocios");
}

export async function renombrarNegocio(id: string, nombre: string) {
  const parsed = negocioSchema.parse({ nombre });
  const supabase = await createClient();
  const { error } = await supabase.from("negocios").update(parsed).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/negocios");
}

export async function toggleNegocioActivo(id: string, activo: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("negocios").update({ activo }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/negocios");
}
