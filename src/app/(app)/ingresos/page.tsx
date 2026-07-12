import { createClient } from "@/lib/supabase/server";
import type { Distribucion, Ingreso, Negocio } from "@/lib/types";
import { IngresoForm } from "./IngresoForm";
import { IngresoRow } from "./IngresoRow";

export default async function IngresosPage() {
  const supabase = await createClient();

  const [{ data: ingresos }, { data: negocios }, { data: distribucion }] = await Promise.all([
    supabase
      .from("ingresos")
      .select("*, negocios(id, nombre)")
      .order("fecha", { ascending: false })
      .returns<Ingreso[]>(),
    supabase.from("negocios").select("*").eq("activo", true).order("nombre").returns<Negocio[]>(),
    supabase.from("distribucion").select("*").order("orden").returns<Distribucion[]>(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-slate-900">Ingresos</h1>

      <IngresoForm negocios={negocios ?? []} distribucion={distribucion ?? []} />

      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4">
        {ingresos?.map((ingreso) => (
          <IngresoRow key={ingreso.id} ingreso={ingreso} distribucion={distribucion ?? []} />
        ))}
        {!ingresos?.length && (
          <p className="py-4 text-center text-sm text-slate-400">Sin ingresos todavía.</p>
        )}
      </div>
    </div>
  );
}
