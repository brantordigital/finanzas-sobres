"use client";

import { useActionState, useMemo, useState } from "react";
import type { Distribucion } from "@/lib/types";
import { actualizarDistribucion } from "./actions";

export function DistribucionForm({ items }: { items: Distribucion[] }) {
  const [valores, setValores] = useState(
    Object.fromEntries(items.map((item) => [item.id, item.porcentaje]))
  );
  const [state, formAction, pending] = useActionState(actualizarDistribucion, {
    error: null,
    success: false,
  });

  const total = useMemo(
    () => Object.values(valores).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [valores]
  );
  const totalOk = Math.round(total * 100) / 100 === 100;

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4">
          <label htmlFor={item.id} className="text-sm text-gray-700">
            {item.categoria}
          </label>
          <div className="flex items-center gap-1">
            <input type="hidden" name="id" value={item.id} />
            <input
              id={item.id}
              name="porcentaje"
              type="number"
              step="0.01"
              min={0}
              max={100}
              value={valores[item.id]}
              onChange={(e) =>
                setValores((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
              }
              className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-right text-sm focus:border-gray-500 focus:outline-none"
            />
            <span className="text-sm text-gray-400">%</span>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-sm font-medium text-gray-700">Total</span>
        <span className={`text-sm font-semibold ${totalOk ? "text-green-600" : "text-red-600"}`}>
          {total}%
        </span>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-600">Distribución guardada.</p>}

      <button
        type="submit"
        disabled={pending || !totalOk}
        className="self-start rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
