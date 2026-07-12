"use client";

import { useState } from "react";
import type { Distribucion, Negocio } from "@/lib/types";
import { formatEUR } from "@/lib/format";
import { crearIngreso } from "./actions";

export function IngresoForm({
  negocios,
  distribucion,
}: {
  negocios: Negocio[];
  distribucion: Distribucion[];
}) {
  const [importe, setImporte] = useState<number>(0);

  return (
    <form
      action={async (formData) => {
        await crearIngreso(formData);
        setImporte(0);
      }}
      className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4"
    >
      <div className="grid grid-cols-2 gap-4">
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
          <label htmlFor="negocio_id" className="block text-sm font-medium text-slate-700">
            Negocio
          </label>
          <select
            id="negocio_id"
            name="negocio_id"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            {negocios.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre}
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
          value={importe || ""}
          onChange={(e) => setImporte(Number(e.target.value))}
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

      {importe > 0 && (
        <div className="rounded-md bg-slate-50 p-3 text-sm">
          <p className="mb-2 font-medium text-slate-700">Desglose por categoría</p>
          <ul className="flex flex-col gap-1">
            {distribucion.map((d) => (
              <li key={d.id} className="flex justify-between text-slate-600">
                <span>
                  {d.categoria} ({d.porcentaje}%)
                </span>
                <span>{formatEUR((importe * d.porcentaje) / 100)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Registrar ingreso
      </button>
    </form>
  );
}
