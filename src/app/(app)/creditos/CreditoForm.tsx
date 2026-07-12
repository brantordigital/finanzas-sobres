"use client";

import type { Socio } from "@/lib/types";
import { crearCredito } from "./actions";

export function CreditoForm({ socios }: { socios: Socio[] }) {
  return (
    <form
      action={crearCredito}
      className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          <label htmlFor="de_socio_id" className="block text-sm font-medium text-slate-700">
            De
          </label>
          <select
            id="de_socio_id"
            name="de_socio_id"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            {socios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="para_socio_id" className="block text-sm font-medium text-slate-700">
            Para
          </label>
          <select
            id="para_socio_id"
            name="para_socio_id"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            {socios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ingreso" className="block text-sm font-medium text-slate-700">
            Ingreso
          </label>
          <input
            id="ingreso"
            name="ingreso"
            type="number"
            step="0.01"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="egreso" className="block text-sm font-medium text-slate-700">
            Egreso
          </label>
          <input
            id="egreso"
            name="egreso"
            type="number"
            step="0.01"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fecha_solucionado" className="block text-sm font-medium text-slate-700">
            Fecha solucionado
          </label>
          <input
            id="fecha_solucionado"
            name="fecha_solucionado"
            type="date"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="observaciones" className="block text-sm font-medium text-slate-700">
            Observaciones
          </label>
          <input
            id="observaciones"
            name="observaciones"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Registrar movimiento
      </button>
    </form>
  );
}
