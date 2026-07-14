export function MonthFilter({ mes }: { mes: string | undefined }) {
  return (
    <form
      method="get"
      className="flex flex-wrap items-end gap-2"
    >
      <input
        id="mes"
        name="mes"
        type="month"
        defaultValue={mes ?? ""}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Filtrar
      </button>
      {mes && (
        <a href="?" className="rounded-md px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">
          Ver todo
        </a>
      )}
    </form>
  );
}
