import { createClient } from "@/lib/supabase/server";
import type { PrestamoSocio, Socio } from "@/lib/types";
import { monthRange } from "@/lib/format";
import { MonthFilter } from "@/components/MonthFilter";
import { PrestamoFormToggle } from "./PrestamoFormToggle";
import { PrestamoRow } from "./PrestamoRow";

export default async function PrestamosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes } = await searchParams;
  const supabase = await createClient();

  let prestamosQuery = supabase
    .from("prestamos_socios")
    .select("*, socios(id, nombre)")
    .order("fecha", { ascending: false });
  if (mes) {
    const { start, end } = monthRange(mes);
    prestamosQuery = prestamosQuery.gte("fecha", start).lte("fecha", end);
  }

  const [{ data: prestamos }, { data: socios }] = await Promise.all([
    prestamosQuery.returns<PrestamoSocio[]>(),
    supabase.from("socios").select("*").order("nombre").returns<Socio[]>(),
  ]);

  const sociosActivos = (socios ?? []).filter((s) => s.activo);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Préstamos a Socios</h1>
        <PrestamoFormToggle socios={sociosActivos} />
      </div>

      <MonthFilter mes={mes} />

      <div className="flex flex-col rounded-lg border border-gray-200 bg-white">
        {prestamos?.map((prestamo) => (
          <PrestamoRow key={prestamo.id} prestamo={prestamo} socios={socios ?? []} />
        ))}
        {!prestamos?.length && (
          <p className="py-4 text-center text-sm text-gray-400">
            {mes ? "Sin préstamos en este mes." : "Sin préstamos todavía."}
          </p>
        )}
      </div>
    </div>
  );
}
