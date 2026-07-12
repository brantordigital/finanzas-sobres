"use client";

import { useTransition } from "react";
import type { PrestamoSocio } from "@/lib/types";
import { formatEUR, formatDate } from "@/lib/format";
import { eliminarPrestamo } from "./actions";

export function PrestamoRow({ prestamo }: { prestamo: PrestamoSocio }) {
  const [isPending, startTransition] = useTransition();
  const saldo = prestamo.ingreso - prestamo.egreso;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-slate-100 px-3 py-2 text-sm">
      <span className="shrink-0 text-slate-500">{formatDate(prestamo.fecha)}</span>
      <span className="flex-1 truncate text-slate-700">{prestamo.socios?.nombre}</span>
      <span className="shrink-0 text-right text-red-600">{formatEUR(prestamo.egreso)}</span>
      <span className="shrink-0 text-right text-green-700">
        {formatEUR(prestamo.ingreso)}
      </span>
      <span className="shrink-0 text-right font-medium text-slate-900">
        {formatEUR(saldo)}
      </span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("¿Eliminar este movimiento?")) {
            startTransition(() => eliminarPrestamo(prestamo.id));
          }
        }}
        className="shrink-0 text-slate-400 hover:text-red-600 disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  );
}
