import { createClient } from "@/lib/supabase/server";
import { CambiarPasswordForm } from "./CambiarPasswordForm";

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Cuenta</h1>
        <p className="text-sm text-slate-500">{user?.email}</p>
      </div>
      <CambiarPasswordForm />
    </div>
  );
}
