"use client";

import { useState, useTransition } from "react";
import type { Negocio } from "@/lib/types";
import { renombrarNegocio, toggleNegocioActivo } from "./actions";

export function NegocioRow({ negocio }: { negocio: Negocio }) {
  const [nombre, setNombre] = useState(negocio.nombre);
  const [isPending, startTransition] = useTransition();

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
          className="w-full rounded-md border border-transparent px-2 py-1 text-sm hover:border-slate-200 focus:border-slate-400 focus:outline-none"
        />
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
          className="text-sm text-slate-500 hover:text-slate-900 disabled:opacity-50"
        >
          {negocio.activo ? "Desactivar" : "Activar"}
        </button>
      </td>
    </tr>
  );
}
