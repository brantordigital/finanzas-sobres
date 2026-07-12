"use client";

import { useState, useTransition } from "react";
import type { PrestamoSocio, Socio } from "@/lib/types";
import { formatEUR, formatDate } from "@/lib/format";
import { actualizarPrestamo, eliminarPrestamo } from "./actions";

export function PrestamoRow({
  prestamo,
  socios,
}: {
  prestamo: PrestamoSocio;
  socios: Socio[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saldo = prestamo.ingreso - prestamo.egreso;

  if (editing) {
    return (
      <form
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            try {
              await actualizarPrestamo(prestamo.id, formData);
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
              defaultValue={prestamo.fecha}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Socio</label>
            <select
              name="socio_id"
              required
              defaultValue={prestamo.socio_id}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            >
              {socios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-500">Egreso (prestado)</label>
            <input
              name="egreso"
              type="number"
              step="0.01"
              min={0}
              defaultValue={prestamo.egreso}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Ingreso (devuelto)</label>
            <input
              name="ingreso"
              type="number"
              step="0.01"
              min={0}
              defaultValue={prestamo.ingreso}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">Observaciones</label>
          <input
            name="observaciones"
            defaultValue={prestamo.observaciones ?? ""}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
          />
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
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-slate-100 px-3 py-2 text-sm">
      <span className="shrink-0 text-slate-500">{formatDate(prestamo.fecha)}</span>
      <span className="w-full truncate text-slate-700 sm:w-auto sm:flex-1">{prestamo.socios?.nombre}</span>
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
        onClick={() => setEditing(true)}
        className="shrink-0 text-slate-400 hover:text-slate-900 disabled:opacity-50"
      >
        Editar
      </button>
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
