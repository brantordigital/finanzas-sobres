"use client";

import { useState, useTransition } from "react";
import type { Socio } from "@/lib/types";
import { eliminarSocio, renombrarSocio, toggleSocioActivo } from "./actions";

export function SocioRow({ socio }: { socio: Socio }) {
  const [nombre, setNombre] = useState(socio.nombre);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <tr className="border-b border-slate-100">
      <td className="py-2 pr-4">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => {
            if (nombre.trim() && nombre !== socio.nombre) {
              startTransition(() => renombrarSocio(socio.id, nombre));
            }
          }}
          className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-slate-500 focus:outline-none"
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
      <td className="py-2 pr-4">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            socio.activo ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {socio.activo ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="py-2 text-right">
        <button
          disabled={isPending}
          onClick={() => startTransition(() => toggleSocioActivo(socio.id, !socio.activo))}
          className="mr-3 text-sm text-slate-500 hover:text-slate-900 disabled:opacity-50"
        >
          {socio.activo ? "Desactivar" : "Activar"}
        </button>
        <button
          disabled={isPending}
          onClick={() => {
            if (!confirm(`¿Eliminar "${socio.nombre}"? Esta acción no se puede deshacer.`)) {
              return;
            }
            setError(null);
            startTransition(async () => {
              try {
                await eliminarSocio(socio.id);
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
