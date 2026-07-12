export function MonthFilter({ mes }: { mes: string | undefined }) {
  return (
    <form
      method="get"
      className="flex flex-wrap items-end gap-2 rounded-lg border border-slate-200 bg-white p-4"
    >
      <div>
        <label htmlFor="mes" className="block text-sm font-medium text-slate-700">
          Mes
        </label>
        <input
          id="mes"
          name="mes"
          type="month"
          defaultValue={mes ?? ""}
          className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Filtrar
      </button>
      {mes && (
        <a href="?" className="rounded-md px-4 py-2 text-sm text-slate-500 hover:bg-slate-100">
          Ver todo
        </a>
      )}
    </form>
  );
}
