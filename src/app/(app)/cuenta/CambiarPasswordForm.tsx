"use client";

import { useActionState } from "react";
import { cambiarPassword } from "./actions";

export function CambiarPasswordForm() {
  const [state, formAction, pending] = useActionState<
    { error: string | null; success: boolean },
    FormData
  >(cambiarPassword, { error: null, success: false });

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Nueva contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="confirmacion" className="block text-sm font-medium text-gray-700">
          Confirmar contraseña
        </label>
        <input
          id="confirmacion"
          name="confirmacion"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-600">Contraseña actualizada.</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}
