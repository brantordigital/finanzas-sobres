"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function cambiarPassword(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
) {
  const password = formData.get("password") as string;
  const confirmacion = formData.get("confirmacion") as string;

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres.", success: false };
  }
  if (password !== confirmacion) {
    return { error: "Las contraseñas no coinciden.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/cuenta");
  return { error: null, success: true };
}
