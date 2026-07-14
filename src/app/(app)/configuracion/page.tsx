import { createClient } from "@/lib/supabase/server";
import type { Distribucion } from "@/lib/types";
import { DistribucionForm } from "./DistribucionForm";

export default async function ConfiguracionPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("distribucion")
    .select("*")
    .order("orden")
    .returns<Distribucion[]>();

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">Distribución por sobres</h1>
        <p className="text-sm text-gray-500">
          Porcentaje de cada ingreso que se reparte a cada categoría. Debe sumar 100%.
        </p>
      </div>
      <DistribucionForm items={items ?? []} />
    </div>
  );
}
