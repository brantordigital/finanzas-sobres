import { createClient } from "@/lib/supabase/server";
import type { Distribucion, Negocio } from "@/lib/types";
import { currentMonth, monthRange, formatEUR } from "@/lib/format";
import { DashboardFilters } from "./DashboardFilters";
import { KpiCard } from "./KpiCard";
import { CategoriaChart } from "./CategoriaChart";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; negocio?: string }>;
}) {
  const params = await searchParams;
  const mes = params.mes || currentMonth();
  const negocioId = params.negocio || "";
  const { start, end } = monthRange(mes);

  const supabase = await createClient();

  const [{ data: negocios }, { data: distribucion }] = await Promise.all([
    supabase.from("negocios").select("*").order("nombre").returns<Negocio[]>(),
    supabase.from("distribucion").select("*").order("orden").returns<Distribucion[]>(),
  ]);

  let ingresosQuery = supabase
    .from("ingresos")
    .select("importe")
    .gte("fecha", start)
    .lte("fecha", end);
  if (negocioId) ingresosQuery = ingresosQuery.eq("negocio_id", negocioId);

  const [{ data: ingresos }, { data: gastos }, { data: creditos }, { data: prestamos }] =
    await Promise.all([
      ingresosQuery.returns<{ importe: number }[]>(),
      supabase
        .from("gastos")
        .select("categoria, importe")
        .gte("fecha", start)
        .lte("fecha", end)
        .returns<{ categoria: string; importe: number }[]>(),
      supabase
        .from("creditos_socios")
        .select("ingreso, egreso")
        .gte("fecha", start)
        .lte("fecha", end)
        .returns<{ ingreso: number; egreso: number }[]>(),
      supabase
        .from("prestamos_socios")
        .select("ingreso, egreso")
        .gte("fecha", start)
        .lte("fecha", end)
        .returns<{ ingreso: number; egreso: number }[]>(),
    ]);

  const totalIngresos = (ingresos ?? []).reduce((sum, i) => sum + i.importe, 0);

  const gastosPorCategoria = new Map<string, number>();
  for (const g of gastos ?? []) {
    gastosPorCategoria.set(g.categoria, (gastosPorCategoria.get(g.categoria) ?? 0) + g.importe);
  }

  const chartData = (distribucion ?? []).map((d) => {
    const ingresosCategoria = (totalIngresos * d.porcentaje) / 100;
    const gastosCategoria = gastosPorCategoria.get(d.categoria) ?? 0;
    return {
      categoria: d.categoria,
      ingresos: ingresosCategoria,
      gastos: gastosCategoria,
      saldo: ingresosCategoria - gastosCategoria,
    };
  });

  const saldoDisponible = chartData.reduce((sum, c) => sum + c.saldo, 0);
  const saldoPrestamos = (prestamos ?? []).reduce((sum, p) => sum + p.ingreso - p.egreso, 0);
  const saldoCreditos = (creditos ?? []).reduce((sum, c) => sum + c.ingreso - c.egreso, 0);
  const estadoCaja = saldoDisponible + saldoPrestamos + saldoCreditos;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-slate-900">Análisis</h1>

      <DashboardFilters mes={mes} negocioId={negocioId} negocios={negocios ?? []} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Total ingresos" value={totalIngresos} />
        <KpiCard label="Saldo disponible" value={saldoDisponible} />
        <KpiCard
          label="Préstamos a socios"
          value={saldoPrestamos}
          tone={saldoPrestamos < 0 ? "negative" : "positive"}
        />
        <KpiCard
          label="Créditos de socios"
          value={saldoCreditos}
          tone={saldoCreditos < 0 ? "negative" : "positive"}
        />
        <KpiCard
          label="Estado de caja"
          value={estadoCaja}
          tone={estadoCaja < 0 ? "negative" : "positive"}
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-4 text-sm font-medium text-slate-700">Ingresos vs. gastos por categoría</h2>
        <CategoriaChart data={chartData} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
              <th className="pb-2 font-medium">Categoría</th>
              <th className="pb-2 text-right font-medium">Ingresos</th>
              <th className="pb-2 text-right font-medium">Gastos</th>
              <th className="pb-2 text-right font-medium">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row) => (
              <tr key={row.categoria} className="border-b border-slate-100">
                <td className="py-2">{row.categoria}</td>
                <td className="py-2 text-right">{formatEUR(row.ingresos)}</td>
                <td className="py-2 text-right">{formatEUR(row.gastos)}</td>
                <td
                  className={`py-2 text-right font-medium ${
                    row.saldo < 0 ? "text-red-600" : "text-slate-900"
                  }`}
                >
                  {formatEUR(row.saldo)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
