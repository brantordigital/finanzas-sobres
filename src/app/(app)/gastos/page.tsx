import { createClient } from "@/lib/supabase/server";
import type { Distribucion, Gasto } from "@/lib/types";
import { monthRange } from "@/lib/format";
import { MonthFilter } from "@/components/MonthFilter";
import { GastoFormToggle } from "./GastoFormToggle";
import { GastoRow } from "./GastoRow";

export default async function GastosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes } = await searchParams;
  const supabase = await createClient();

  let gastosQuery = supabase.from("gastos").select("*").order("fecha", { ascending: false });
  if (mes) {
    const { start, end } = monthRange(mes);
    gastosQuery = gastosQuery.gte("fecha", start).lte("fecha", end);
  }

  const [{ data: gastos }, { data: distribucion }] = await Promise.all([
    gastosQuery.returns<Gasto[]>(),
    supabase.from("distribucion").select("*").order("orden").returns<Distribucion[]>(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Gastos</h1>
        <GastoFormToggle distribucion={distribucion ?? []} />
      </div>

      <MonthFilter mes={mes} />

      <div className="flex flex-col rounded-lg border border-gray-200 bg-white">
        {gastos?.map((gasto) => (
          <GastoRow key={gasto.id} gasto={gasto} distribucion={distribucion ?? []} />
        ))}
        {!gastos?.length && (
          <p className="py-4 text-center text-sm text-gray-400">
            {mes ? "Sin gastos en este mes." : "Sin gastos todavía."}
          </p>
        )}
      </div>
    </div>
  );
}
