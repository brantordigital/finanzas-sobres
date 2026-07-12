import { createClient } from "@/lib/supabase/server";
import type { Distribucion, Gasto } from "@/lib/types";
import { GastoForm } from "./GastoForm";
import { GastoRow } from "./GastoRow";

export default async function GastosPage() {
  const supabase = await createClient();

  const [{ data: gastos }, { data: distribucion }] = await Promise.all([
    supabase.from("gastos").select("*").order("fecha", { ascending: false }).returns<Gasto[]>(),
    supabase.from("distribucion").select("*").order("orden").returns<Distribucion[]>(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-slate-900">Gastos</h1>

      <GastoForm distribucion={distribucion ?? []} />

      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4">
        {gastos?.map((gasto) => (
          <GastoRow key={gasto.id} gasto={gasto} distribucion={distribucion ?? []} />
        ))}
        {!gastos?.length && (
          <p className="py-4 text-center text-sm text-slate-400">Sin gastos todavía.</p>
        )}
      </div>
    </div>
  );
}
