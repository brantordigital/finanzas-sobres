"use client";

import type { Socio } from "@/lib/types";
import { crearPrestamo } from "./actions";

export function PrestamoForm({ socios }: { socios: Socio[] }) {
  return (
    <form
      action={crearPrestamo}
      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="socio_id" className="block text-sm font-medium text-gray-700">
            Socio
          </label>
          <select
            id="socio_id"
            name="socio_id"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
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
          <label htmlFor="egreso" className="block text-sm font-medium text-gray-700">
            Egreso (prestado)
          </label>
          <input
            id="egreso"
            name="egreso"
            type="number"
            step="0.01"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ingreso" className="block text-sm font-medium text-gray-700">
            Ingreso (devuelto)
          </label>
          <input
            id="ingreso"
            name="ingreso"
            type="number"
            step="0.01"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
          Observaciones
        </label>
        <input
          id="observaciones"
          name="observaciones"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="self-start rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Registrar movimiento
      </button>
    </form>
  );
}
