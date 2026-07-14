"use client";

import { useState, useTransition } from "react";
import type { CreditoSocio, Socio } from "@/lib/types";
import { formatEUR, formatDate } from "@/lib/format";
import { actualizarCredito, eliminarCredito, marcarCreditoSolucionado } from "./actions";

export function CreditoRow({
  credito,
  socios,
}: {
  credito: CreditoSocio;
  socios: Socio[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saldo = credito.ingreso - credito.egreso;

  if (editing) {
    return (
      <form
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            try {
              await actualizarCredito(credito.id, formData);
              setEditing(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : "No se pudo guardar.");
            }
          });
        }}
        className="flex flex-col gap-3 rounded-md bg-gray-50 px-3 py-3 text-sm"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-gray-500">Fecha</label>
            <input
              name="fecha"
              type="date"
              required
              defaultValue={credito.fecha}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">De</label>
            <select
              name="de_socio_id"
              required
              defaultValue={credito.de_socio_id}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
            >
              {socios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Para</label>
            <select
              name="para_socio_id"
              required
              defaultValue={credito.para_socio_id}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
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
            <label className="block text-xs font-medium text-gray-500">Ingreso</label>
            <input
              name="ingreso"
              type="number"
              step="0.01"
              min={0}
              defaultValue={credito.ingreso}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Egreso</label>
            <input
              name="egreso"
              type="number"
              step="0.01"
              min={0}
              defaultValue={credito.egreso}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-500">Fecha solucionado</label>
            <input
              name="fecha_solucionado"
              type="date"
              defaultValue={credito.fecha_solucionado ?? ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Observaciones</label>
            <input
              name="observaciones"
              defaultValue={credito.observaciones ?? ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-gray-100 px-3 py-2 text-sm">
      <span className="shrink-0 text-gray-500">{formatDate(credito.fecha)}</span>
      <span className="w-full truncate text-gray-700 sm:w-auto sm:flex-1">
        {credito.de_socio?.nombre} → {credito.para_socio?.nombre}
      </span>
      <span className="shrink-0 text-right text-emerald-600">
        {formatEUR(credito.ingreso)}
      </span>
      <span className="shrink-0 text-right text-rose-600">{formatEUR(credito.egreso)}</span>
      <span className={`shrink-0 text-right font-medium ${saldo < 0 ? "text-rose-600" : "text-emerald-600"}`}>
        {formatEUR(saldo)}
      </span>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(() =>
            marcarCreditoSolucionado(
              credito.id,
              credito.fecha_solucionado ? null : new Date().toISOString().slice(0, 10)
            )
          )
        }
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
          credito.fecha_solucionado
            ? "bg-emerald-100 text-emerald-700"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {credito.fecha_solucionado ? "Solucionado" : "Pendiente"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setEditing(true)}
        className="shrink-0 text-gray-400 hover:text-gray-700 disabled:opacity-50"
        aria-label="Editar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125 16.862 4.487" />
        </svg>
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("¿Eliminar este movimiento?")) {
            startTransition(() => eliminarCredito(credito.id));
          }
        }}
        className="shrink-0 text-gray-400 hover:text-rose-600 disabled:opacity-50"
        aria-label="Eliminar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
  );
}
