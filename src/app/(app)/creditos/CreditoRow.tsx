"use client";

import { useTransition } from "react";
import type { CreditoSocio } from "@/lib/types";
import { formatEUR, formatDate } from "@/lib/format";
import { eliminarCredito, marcarCreditoSolucionado } from "./actions";

export function CreditoRow({ credito }: { credito: CreditoSocio }) {
  const [isPending, startTransition] = useTransition();
  const saldo = credito.ingreso - credito.egreso;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-slate-100 px-3 py-2 text-sm">
      <span className="shrink-0 text-slate-500">{formatDate(credito.fecha)}</span>
      <span className="w-full truncate text-slate-700 sm:w-auto sm:flex-1">
        {credito.de_socio?.nombre} → {credito.para_socio?.nombre}
      </span>
      <span className="shrink-0 text-right text-green-700">
        {formatEUR(credito.ingreso)}
      </span>
      <span className="shrink-0 text-right text-red-600">{formatEUR(credito.egreso)}</span>
      <span className="shrink-0 text-right font-medium text-slate-900">
        {formatEUR(saldo)}
      </span>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(() =>
            marcarCreditoSolucionado(
              credito.id,
              credito.fecha_solucionado ? null : new Date().toISOString().slice(0, 10)
            )
          )
        }
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
          credito.fecha_solucionado
            ? "bg-green-100 text-green-700"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {credito.fecha_solucionado ? "Solucionado" : "Pendiente"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("¿Eliminar este movimiento?")) {
            startTransition(() => eliminarCredito(credito.id));
          }
        }}
        className="shrink-0 text-slate-400 hover:text-red-600 disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  );
}
