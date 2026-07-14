"use client";

import { useRef, useState } from "react";
import type { Distribucion } from "@/lib/types";
import { crearGasto } from "./actions";

export function GastoForm({
  distribucion,
  onClose,
}: {
  distribucion: Distribucion[];
  onClose: () => void;
}) {
  const [showNotas, setShowNotas] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await crearGasto(formData);
        setShowNotas(false);
        formRef.current?.reset();
        onClose();
      }}
      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Nuevo gasto</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Cerrar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

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
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
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
        <label htmlFor="importe" className="block text-sm font-medium text-gray-700">
          Importe
        </label>
        <input
          id="importe"
          name="importe"
          type="number"
          step="0.01"
          min={0.01}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="concepto" className="block text-sm font-medium text-gray-700">
          Concepto
        </label>
        <input
          id="concepto"
          name="concepto"
          required
          placeholder="Ej: Alquiler oficina"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {!showNotas ? (
        <button
          type="button"
          onClick={() => setShowNotas(true)}
          className="self-start text-sm text-gray-500 hover:text-gray-700"
        >
          + Añadir notas
        </button>
      ) : (
        <div>
          <label htmlFor="observacion" className="block text-sm font-medium text-gray-700">
            Observaciones
          </label>
          <textarea
            id="observacion"
            name="observacion"
            rows={2}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="debo" className="rounded border-gray-300" />
        Debo (gasto pendiente)
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Registrar gasto
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
