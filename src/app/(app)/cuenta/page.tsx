import { createClient } from "@/lib/supabase/server";
import { CambiarPasswordForm } from "./CambiarPasswordForm";
import { InvitarSocioForm } from "./InvitarSocioForm";

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">Cuenta</h1>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
      <CambiarPasswordForm />
      <InvitarSocioForm />
    </div>
  );
}
