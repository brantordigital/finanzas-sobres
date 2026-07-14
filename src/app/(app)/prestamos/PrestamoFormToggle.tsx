"use client";

import { useState } from "react";
import type { Socio } from "@/lib/types";
import { PrestamoForm } from "./PrestamoForm";

export function PrestamoFormToggle({ socios }: { socios: Socio[] }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        + Nuevo préstamo
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 px-4 pt-24">
      <div className="w-full max-w-lg">
        <PrestamoForm socios={socios} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
