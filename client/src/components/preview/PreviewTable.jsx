export default function PreviewTable({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-400 py-8">No data to preview</p>;
  }

  const columns = Object.keys(data[0]);
  const rows = data.slice(0, 20);

  return (
    <div className="overflow-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b">#</th>
            {columns.map(col => (
              <th
                key={col}
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              <td className="px-3 py-2 text-gray-400 font-mono text-xs">{i + 1}</td>
              {columns.map(col => (
                <td key={col} className="px-3 py-2 text-gray-700 whitespace-nowrap max-w-[200px] truncate">
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 20 && (
        <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 border-t">
          Showing 20 of {data.length} rows
        </div>
      )}
    </div>
  );
}
