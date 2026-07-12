"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const itemSchema = z.object({
  id: z.string().uuid(),
  porcentaje: z.coerce.number().min(0).max(100),
});

export async function actualizarDistribucion(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
) {
  const ids = formData.getAll("id") as string[];
  const porcentajes = formData.getAll("porcentaje") as string[];

  const items = ids.map((id, i) => itemSchema.parse({ id, porcentaje: porcentajes[i] }));
  const total = items.reduce((sum, item) => sum + item.porcentaje, 0);

  if (Math.round(total * 100) / 100 !== 100) {
    return { error: `Los porcentajes deben sumar 100% (suman ${total}%).`, success: false };
  }

  const supabase = await createClient();
  for (const item of items) {
    const { error } = await supabase
      .from("distribucion")
      .update({ porcentaje: item.porcentaje, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    if (error) return { error: error.message, success: false };
  }

  revalidatePath("/configuracion");
  return { error: null, success: true };
}
