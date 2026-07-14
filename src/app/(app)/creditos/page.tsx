import { createClient } from "@/lib/supabase/server";
import type { CreditoSocio, Socio } from "@/lib/types";
import { monthRange } from "@/lib/format";
import { MonthFilter } from "@/components/MonthFilter";
import { CreditoFormToggle } from "./CreditoFormToggle";
import { CreditoRow } from "./CreditoRow";

export default async function CreditosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes } = await searchParams;
  const supabase = await createClient();

  let creditosQuery = supabase
    .from("creditos_socios")
    .select("*, de_socio:socios!de_socio_id(id, nombre), para_socio:socios!para_socio_id(id, nombre)")
    .order("fecha", { ascending: false });
  if (mes) {
    const { start, end } = monthRange(mes);
    creditosQuery = creditosQuery.gte("fecha", start).lte("fecha", end);
  }

  const [{ data: creditos }, { data: socios }] = await Promise.all([
    creditosQuery.returns<CreditoSocio[]>(),
    supabase.from("socios").select("*").order("nombre").returns<Socio[]>(),
  ]);

  const sociosActivos = (socios ?? []).filter((s) => s.activo);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Créditos de Socios</h1>
        <CreditoFormToggle socios={sociosActivos} />
      </div>

      <MonthFilter mes={mes} />

      <div className="flex flex-col rounded-lg border border-gray-200 bg-white">
        {creditos?.map((credito) => (
          <CreditoRow key={credito.id} credito={credito} socios={socios ?? []} />
        ))}
        {!creditos?.length && (
          <p className="py-4 text-center text-sm text-gray-400">
            {mes ? "Sin movimientos en este mes." : "Sin movimientos todavía."}
          </p>
        )}
      </div>
    </div>
  );
}
