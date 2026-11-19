export default function FusklappTable({ table }) {
  return (
    <div className="space-y-1.5">
      {table.label && (
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{table.label}</p>
      )}
      <div className="overflow-x-auto rounded-xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {table.columns.map((column) => (
                <th
                  key={column}
                  className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-border/50 align-top">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={
                      cellIndex === 0
                        ? "px-3 py-1.5 font-medium whitespace-nowrap"
                        : "px-3 py-1.5 text-muted-foreground"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}