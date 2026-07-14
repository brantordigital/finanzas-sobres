"use client";

import { useActionState } from "react";
import { crearAccesoSocio } from "./actions";

export function InvitarSocioForm() {
  const [state, formAction, pending] = useActionState<
    { error: string | null; email: string | null; password: string | null },
    FormData
  >(crearAccesoSocio, { error: null, email: null, password: null });

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-800">Dar acceso a un socio</h2>
        <p className="text-sm text-gray-500">
          Crea la cuenta directamente con una contraseña temporal — no se envía ningún email.
        </p>
      </div>
      <form action={formAction} className="flex flex-wrap items-end gap-2">
        <div className="flex-1">
          <label htmlFor="socio-email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="socio-email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? "Creando..." : "Crear acceso"}
        </button>
      </form>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.password && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          <p className="font-medium">Cuenta creada. Pásale estos datos por un canal seguro:</p>
          <p className="mt-1">
            Email: <span className="font-mono">{state.email}</span>
          </p>
          <p>
            Contraseña temporal: <span className="font-mono">{state.password}</span>
          </p>
          <p className="mt-1 text-xs text-green-700">
            Solo se muestra una vez. Puede cambiarla luego desde Cuenta.
          </p>
        </div>
      )}
    </div>
  );
}
