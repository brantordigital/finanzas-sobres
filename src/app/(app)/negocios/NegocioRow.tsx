"use client";

import { useState, useTransition } from "react";
import type { Negocio } from "@/lib/types";
import { eliminarNegocio, renombrarNegocio, toggleNegocioActivo } from "./actions";

export function NegocioRow({ negocio }: { negocio: Negocio }) {
  const [nombre, setNombre] = useState(negocio.nombre);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <tr className="border-b border-slate-100">
      <td className="py-2 pr-4">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => {
            if (nombre.trim() && nombre !== negocio.nombre) {
              startTransition(() => renombrarNegocio(negocio.id, nombre));
            }
          }}
          className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-slate-500 focus:outline-none"
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
      <td className="py-2 pr-4">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            negocio.activo ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {negocio.activo ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="py-2 text-right">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => toggleNegocioActivo(negocio.id, !negocio.activo))
          }
          className="mr-3 text-sm text-slate-500 hover:text-slate-900 disabled:opacity-50"
        >
          {negocio.activo ? "Desactivar" : "Activar"}
        </button>
        <button
          disabled={isPending}
          onClick={() => {
            if (!confirm(`¿Eliminar "${negocio.nombre}"? Esta acción no se puede deshacer.`)) {
              return;
            }
            setError(null);
            startTransition(async () => {
              try {
                await eliminarNegocio(negocio.id);
              } catch (e) {
                setError(e instanceof Error ? e.message : "No se pudo eliminar.");
              }
            });
          }}
          className="text-sm text-slate-400 hover:text-red-600 disabled:opacity-50"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
