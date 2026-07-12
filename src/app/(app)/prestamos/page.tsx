import { createClient } from "@/lib/supabase/server";
import type { PrestamoSocio, Socio } from "@/lib/types";
import { PrestamoForm } from "./PrestamoForm";
import { PrestamoRow } from "./PrestamoRow";

export default async function PrestamosPage() {
  const supabase = await createClient();

  const [{ data: prestamos }, { data: socios }] = await Promise.all([
    supabase
      .from("prestamos_socios")
      .select("*, socios(id, nombre)")
      .order("fecha", { ascending: false })
      .returns<PrestamoSocio[]>(),
    supabase.from("socios").select("*").eq("activo", true).order("nombre").returns<Socio[]>(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-slate-900">Préstamos a Socios</h1>

      <PrestamoForm socios={socios ?? []} />

      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4">
        {prestamos?.map((prestamo) => (
          <PrestamoRow key={prestamo.id} prestamo={prestamo} />
        ))}
        {!prestamos?.length && (
          <p className="py-4 text-center text-sm text-slate-400">Sin préstamos todavía.</p>
        )}
      </div>
    </div>
  );
}
