import type { Negocio } from "@/lib/types";

export function DashboardFilters({
  mes,
  negocioId,
  negocios,
}: {
  mes: string;
  negocioId: string;
  negocios: Negocio[];
}) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <label htmlFor="mes" className="block text-sm font-medium text-slate-700">
          Mes
        </label>
        <input
          id="mes"
          name="mes"
          type="month"
          defaultValue={mes}
          className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="negocio" className="block text-sm font-medium text-slate-700">
          Negocio (solo ingresos)
        </label>
        <select
          id="negocio"
          name="negocio"
          defaultValue={negocioId}
          className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="">Todos</option>
          {negocios.map((n) => (
            <option key={n.id} value={n.id}>
              {n.nombre}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Filtrar
      </button>
    </form>
  );
}
