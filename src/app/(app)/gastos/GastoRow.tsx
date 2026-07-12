"use client";

import { useTransition } from "react";
import type { Gasto } from "@/lib/types";
import { formatEUR, formatDate } from "@/lib/format";
import { eliminarGasto, toggleGastoDebo } from "./actions";

export function GastoRow({ gasto }: { gasto: Gasto }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-slate-100 px-3 py-2 text-sm">
      <span className="shrink-0 text-slate-500">{formatDate(gasto.fecha)}</span>
      <span className="w-full truncate text-slate-700 sm:w-auto sm:flex-1">{gasto.categoria}</span>
      <span className="w-full shrink-0 truncate text-slate-500 sm:w-32">{gasto.observacion}</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleGastoDebo(gasto.id, !gasto.debo))}
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
          gasto.debo ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"
        }`}
      >
        {gasto.debo ? "Debo" : "Pagado"}
      </button>
      <span className="shrink-0 text-right font-medium text-slate-900">
        {formatEUR(gasto.importe)}
      </span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("¿Eliminar este gasto?")) {
            startTransition(() => eliminarGasto(gasto.id));
          }
        }}
        className="shrink-0 text-slate-400 hover:text-red-600 disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  );
}
