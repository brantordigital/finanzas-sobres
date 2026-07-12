import { createClient } from "@/lib/supabase/server";
import type { Distribucion, Ingreso, Negocio } from "@/lib/types";
import { monthRange } from "@/lib/format";
import { MonthFilter } from "@/components/MonthFilter";
import { IngresoForm } from "./IngresoForm";
import { IngresoRow } from "./IngresoRow";

export default async function IngresosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes } = await searchParams;
  const supabase = await createClient();

  let ingresosQuery = supabase
    .from("ingresos")
    .select("*, negocios(id, nombre)")
    .order("fecha", { ascending: false });
  if (mes) {
    const { start, end } = monthRange(mes);
    ingresosQuery = ingresosQuery.gte("fecha", start).lte("fecha", end);
  }

  const [{ data: ingresos }, { data: negocios }, { data: distribucion }] = await Promise.all([
    ingresosQuery.returns<Ingreso[]>(),
    supabase.from("negocios").select("*").order("nombre").returns<Negocio[]>(),
    supabase.from("distribucion").select("*").order("orden").returns<Distribucion[]>(),
  ]);

  const negociosActivos = (negocios ?? []).filter((n) => n.activo);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-slate-900">Ingresos</h1>

      <IngresoForm negocios={negociosActivos} distribucion={distribucion ?? []} />

      <MonthFilter mes={mes} />

      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4">
        {ingresos?.map((ingreso) => (
          <IngresoRow
            key={ingreso.id}
            ingreso={ingreso}
            distribucion={distribucion ?? []}
            negocios={negocios ?? []}
          />
        ))}
        {!ingresos?.length && (
          <p className="py-4 text-center text-sm text-slate-400">
            {mes ? "Sin ingresos en este mes." : "Sin ingresos todavía."}
          </p>
        )}
      </div>
    </div>
  );
}
