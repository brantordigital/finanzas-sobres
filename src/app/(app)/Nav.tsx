"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "./actions";

const links = [
  { href: "/dashboard", label: "Análisis" },
  { href: "/ingresos", label: "Ingresos" },
  { href: "/gastos", label: "Gastos" },
  { href: "/negocios", label: "Negocios" },
  { href: "/socios", label: "Socios" },
  { href: "/creditos", label: "Créditos" },
  { href: "/prestamos", label: "Préstamos" },
  { href: "/configuracion", label: "Config." },
  { href: "/cuenta", label: "Cuenta" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <span className="text-sm font-semibold text-slate-900">Finanzas</span>

        <div className="hidden flex-1 flex-wrap gap-1 text-sm sm:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 ${
                  active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden sm:block">
          <form action={signOut}>
            <button
              type="submit"
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
            >
              Salir
            </button>
          </form>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 sm:hidden"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 text-sm sm:hidden">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 ${
                  active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-slate-500 hover:bg-slate-100"
            >
              Salir
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
