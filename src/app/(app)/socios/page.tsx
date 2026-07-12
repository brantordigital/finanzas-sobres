import { createClient } from "@/lib/supabase/server";
import type { Socio } from "@/lib/types";
import { crearSocio } from "./actions";
import { SocioRow } from "./SocioRow";

export default async function SociosPage() {
  const supabase = await createClient();
  const { data: socios } = await supabase
    .from("socios")
    .select("*")
    .order("nombre")
    .returns<Socio[]>();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-slate-900">Socios</h1>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
              <th className="pb-2 font-medium">Nombre</th>
              <th className="pb-2 font-medium">Estado</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {socios?.map((socio) => (
              <SocioRow key={socio.id} socio={socio} />
            ))}
            {!socios?.length && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-slate-400">
                  Sin socios todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form
        action={crearSocio}
        className="flex max-w-sm items-end gap-2 rounded-lg border border-slate-200 bg-white p-4"
      >
        <div className="flex-1">
          <label htmlFor="nombre" className="block text-sm font-medium text-slate-700">
            Nuevo socio
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Añadir
        </button>
      </form>
    </div>
  );
}
