"use client";

import { useState, useTransition } from "react";
import type { Distribucion, Gasto } from "@/lib/types";
import { formatEUR, formatDate } from "@/lib/format";
import { actualizarGasto, eliminarGasto, toggleGastoDebo } from "./actions";

export function GastoRow({
  gasto,
  distribucion,
}: {
  gasto: Gasto;
  distribucion: Distribucion[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (editing) {
    return (
      <form
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            try {
              await actualizarGasto(gasto.id, formData);
              setEditing(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : "No se pudo guardar.");
            }
          });
        }}
        className="flex flex-col gap-3 rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-500">Fecha</label>
            <input
              name="fecha"
              type="date"
              required
              defaultValue={gasto.fecha}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Categoría</label>
            <select
              name="categoria"
              required
              defaultValue={gasto.categoria}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            >
              {distribucion.map((d) => (
                <option key={d.id} value={d.categoria}>
                  {d.categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-500">Importe</label>
            <input
              name="importe"
              type="number"
              step="0.01"
              min={0.01}
              required
              defaultValue={gasto.importe}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Observación</label>
            <input
              name="observacion"
              defaultValue={gasto.observacion ?? ""}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" name="debo" defaultChecked={gasto.debo} className="rounded border-slate-300" />
          Debo (gasto pendiente)
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-md px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

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
        onClick={() => setEditing(true)}
        className="shrink-0 text-slate-400 hover:text-slate-900 disabled:opacity-50"
      >
        Editar
      </button>
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
