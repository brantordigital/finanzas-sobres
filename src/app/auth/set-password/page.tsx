import { SetPasswordForm } from "./SetPasswordForm";

export default function SetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-gray-800">Configura tu acceso</h1>
        <p className="mb-6 text-sm text-gray-500">Elige una contraseña para tu cuenta.</p>
        <SetPasswordForm />
      </div>
    </div>
  );
}
