"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [importeInput, setImporteInput] = useState("");
  const importe = parseFloat(importeInput.replace(",", ".")) || 0;

  if (negocios.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Antes de registrar un ingreso necesitas dar de alta al menos un negocio.{" "}
        <Link href="/negocios" className="font-medium text-slate-900 underline">
          Crear negocio
        </Link>
      </div>
    );
  }

  return (
    <form
      action={async (formData) => {
        await crearIngreso(formData);
        setImporteInput("");
      }}
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
