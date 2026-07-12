"use client";

import { useTransition } from "react";
import type { Distribucion, Ingreso } from "@/lib/types";
import { formatEUR, formatDate } from "@/lib/format";
import { eliminarIngreso } from "./actions";

export function IngresoRow({
  ingreso,
  distribucion,
}: {
  ingreso: Ingreso;
  distribucion: Distribucion[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <details className="group rounded-md border border-slate-100 open:bg-slate-50">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 text-sm">
        <span className="shrink-0 text-slate-500">{formatDate(ingreso.fecha)}</span>
        <span className="w-full truncate text-slate-700 sm:w-auto sm:flex-1">{ingreso.negocios?.nombre}</span>
        <span className="w-full shrink-0 truncate text-slate-500 sm:w-28">{ingreso.observaciones}</span>
        <span className="shrink-0 text-right font-medium text-slate-900">
          {formatEUR(ingreso.importe)}
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            e.preventDefault();
            if (confirm("¿Eliminar este ingreso?")) {
              startTransition(() => eliminarIngreso(ingreso.id));
            }
          }}
          className="shrink-0 text-slate-400 hover:text-red-600 disabled:opacity-50"
        >
          Eliminar
        </button>
      </summary>
      <div className="px-3 pb-3">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600 sm:grid-cols-3">
          {distribucion.map((d) => (
            <li key={d.id} className="flex justify-between">
              <span>{d.categoria}</span>
              <span>{formatEUR((ingreso.importe * d.porcentaje) / 100)}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
