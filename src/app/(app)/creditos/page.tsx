import { createClient } from "@/lib/supabase/server";
import type { CreditoSocio, Socio } from "@/lib/types";
import { CreditoForm } from "./CreditoForm";
import { CreditoRow } from "./CreditoRow";

export default async function CreditosPage() {
  const supabase = await createClient();

  const [{ data: creditos }, { data: socios }] = await Promise.all([
    supabase
      .from("creditos_socios")
      .select("*, de_socio:socios!de_socio_id(id, nombre), para_socio:socios!para_socio_id(id, nombre)")
      .order("fecha", { ascending: false })
      .returns<CreditoSocio[]>(),
    supabase.from("socios").select("*").eq("activo", true).order("nombre").returns<Socio[]>(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-slate-900">Créditos de Socios</h1>

      <CreditoForm socios={socios ?? []} />

      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4">
        {creditos?.map((credito) => (
          <CreditoRow key={credito.id} credito={credito} />
        ))}
        {!creditos?.length && (
          <p className="py-4 text-center text-sm text-slate-400">Sin movimientos todavía.</p>
        )}
      </div>
    </div>
  );
}
