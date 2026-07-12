"use client";

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

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <span className="text-sm font-semibold text-slate-900">Finanzas</span>
        <div className="flex flex-1 flex-wrap gap-1 overflow-x-auto text-sm">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
          >
            Salir
          </button>
        </form>
      </div>
    </nav>
  );
}
