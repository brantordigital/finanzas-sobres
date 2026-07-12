"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const socioSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
});

export async function crearSocio(formData: FormData) {
  const parsed = socioSchema.parse({ nombre: formData.get("nombre") });
  const supabase = await createClient();
  const { error } = await supabase.from("socios").insert(parsed);
  if (error) throw new Error(error.message);
  revalidatePath("/socios");
}

export async function renombrarSocio(id: string, nombre: string) {
  const parsed = socioSchema.parse({ nombre });
  const supabase = await createClient();
  const { error } = await supabase.from("socios").update(parsed).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/socios");
}

export async function toggleSocioActivo(id: string, activo: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("socios").update({ activo }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/socios");
}
