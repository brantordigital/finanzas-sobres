"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Distribucion, Negocio } from "@/lib/types";
import { formatEUR } from "@/lib/format";
import { crearIngreso } from "./actions";

export function IngresoForm({
  negocios,
  distribucion,
  onClose,
}: {
  negocios: Negocio[];
  distribucion: Distribucion[];
  onClose: () => void;
}) {
  const [importeInput, setImporteInput] = useState("");
  const [showNotas, setShowNotas] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const importe = parseFloat(importeInput.replace(",", ".")) || 0;

  if (negocios.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
        Antes de registrar un ingreso necesitas dar de alta al menos un negocio.{" "}
        <Link href="/negocios" className="font-medium text-gray-800 underline">
          Crear negocio
        </Link>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await crearIngreso(formData);
        setImporteInput("");
        setShowNotas(false);
        formRef.current?.reset();
        onClose();
      }}
      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Nuevo ingreso</h2>
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
          <label htmlFor="negocio_id" className="block text-sm font-medium text-gray-700">
            Negocio
          </label>
          <select
            id="negocio_id"
            name="negocio_id"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
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
        <label htmlFor="importe" className="block text-sm font-medium text-gray-700">
          Importe
        </label>
        <input type="hidden" name="importe" value={importe} />
        <input
          id="importe"
          type="text"
          inputMode="decimal"
          required
          value={importeInput}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*[.,]?\d*$/.test(value)) {
              setImporteInput(value);
            }
          }}
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
          placeholder="Ej: Venta de un curso"
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
          <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
            Observaciones
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            rows={2}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )}

      {importe > 0 && (
        <div className="rounded-md bg-gray-50 p-3 text-sm">
          <p className="mb-2 font-medium text-gray-700">Desglose por categoría</p>
          <ul className="flex flex-col gap-1">
            {distribucion.map((d) => (
              <li key={d.id} className="flex justify-between text-gray-600">
                <span>
                  {d.categoria} ({d.porcentaje}%)
                </span>
                <span>{formatEUR((importe * d.porcentaje) / 100)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Registrar ingreso
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
