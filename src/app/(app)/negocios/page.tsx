import { createClient } from "@/lib/supabase/server";
import type { Negocio } from "@/lib/types";
import { crearNegocio } from "./actions";
import { NegocioRow } from "./NegocioRow";

export default async function NegociosPage() {
  const supabase = await createClient();
  const { data: negocios } = await supabase
    .from("negocios")
    .select("*")
    .order("nombre")
    .returns<Negocio[]>();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-gray-800">Negocios</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-400">
              <th className="pb-2 font-medium">Nombre</th>
              <th className="pb-2 font-medium">Estado</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {negocios?.map((negocio) => (
              <NegocioRow key={negocio.id} negocio={negocio} />
            ))}
            {!negocios?.length && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-400">
                  Sin negocios todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form
        action={crearNegocio}
        className="flex max-w-sm items-end gap-2 rounded-lg border border-gray-200 bg-white p-4"
      >
        <div className="flex-1">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nuevo negocio
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Añadir
        </button>
      </form>
    </div>
  );
}
