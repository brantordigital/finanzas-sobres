import { createClient } from "@/lib/supabase/server";
import type { Distribucion, Ingreso, Negocio } from "@/lib/types";
import { monthRange } from "@/lib/format";
import { MonthFilter } from "@/components/MonthFilter";
import { IngresoFormToggle } from "./IngresoFormToggle";
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
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Ingresos</h1>
        <IngresoFormToggle negocios={negociosActivos} distribucion={distribucion ?? []} />
      </div>

      <MonthFilter mes={mes} />

      <div className="flex flex-col rounded-lg border border-gray-200 bg-white">
        {ingresos?.map((ingreso) => (
          <IngresoRow
            key={ingreso.id}
            ingreso={ingreso}
            distribucion={distribucion ?? []}
            negocios={negocios ?? []}
          />
        ))}
        {!ingresos?.length && (
          <p className="py-4 text-center text-sm text-gray-400">
            {mes ? "Sin ingresos en este mes." : "Sin ingresos todavía."}
          </p>
        )}
      </div>
    </div>
  );
}
