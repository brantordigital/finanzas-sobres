"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function generarPasswordTemporal(): string {
  return randomBytes(12).toString("base64url") + "!A1";
}

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

const emailSchema = z.string().trim().email("Introduce un email válido.");

export async function crearAccesoSocio(
  _prevState: { error: string | null; email: string | null; password: string | null },
  formData: FormData
) {
  const parsedEmail = emailSchema.safeParse(formData.get("email"));
  if (!parsedEmail.success) {
    return { error: parsedEmail.error.issues[0].message, email: null, password: null };
  }

  const password = generarPasswordTemporal();
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email: parsedEmail.data,
    password,
    email_confirm: true,
  });

  if (error) {
    return { error: error.message, email: null, password: null };
  }

  return { error: null, email: parsedEmail.data, password };
}
