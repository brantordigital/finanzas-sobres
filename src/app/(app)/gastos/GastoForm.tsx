"use client";

import type { Distribucion } from "@/lib/types";
import { crearGasto } from "./actions";

export function GastoForm({ distribucion }: { distribucion: Distribucion[] }) {
  return (
    <form
      action={crearGasto}
      className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-slate-700">
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-slate-700">
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            {distribucion.map((d) => (
              <option key={d.id} value={d.categoria}>
                {d.categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="importe" className="block text-sm font-medium text-slate-700">
          Importe
        </label>
        <input
          id="importe"
          name="importe"
          type="number"
          step="0.01"
          min={0.01}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="observacion" className="block text-sm font-medium text-slate-700">
          Observación
        </label>
        <input
          id="observacion"
          name="observacion"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="debo" className="rounded border-slate-300" />
        Debo (gasto pendiente)
      </label>

      <button
        type="submit"
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Registrar gasto
      </button>
    </form>
  );
}
