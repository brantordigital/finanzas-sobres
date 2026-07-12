"use client";

import { useState, useTransition } from "react";
import type { Distribucion, Ingreso, Negocio } from "@/lib/types";
import { formatEUR, formatDate } from "@/lib/format";
import { actualizarIngreso, eliminarIngreso } from "./actions";

export function IngresoRow({
  ingreso,
  distribucion,
  negocios,
}: {
  ingreso: Ingreso;
  distribucion: Distribucion[];
  negocios: Negocio[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [importeInput, setImporteInput] = useState(String(ingreso.importe));
  const [error, setError] = useState<string | null>(null);

  if (editing) {
    return (
      <form
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            try {
              await actualizarIngreso(ingreso.id, formData);
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
              defaultValue={ingreso.fecha}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Negocio</label>
            <select
              name="negocio_id"
              required
              defaultValue={ingreso.negocio_id}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            >
              {negocios.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-500">Importe</label>
            <input type="hidden" name="importe" value={parseFloat(importeInput.replace(",", ".")) || 0} />
            <input
              type="text"
              inputMode="decimal"
              required
              value={importeInput}
              onChange={(e) => {
                if (/^\d*[.,]?\d*$/.test(e.target.value)) setImporteInput(e.target.value);
              }}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Observaciones</label>
            <input
              name="observaciones"
              defaultValue={ingreso.observaciones ?? ""}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
        </div>
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
            setEditing(true);
          }}
          className="shrink-0 text-slate-400 hover:text-slate-900 disabled:opacity-50"
        >
          Editar
        </button>
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
