export default function TransformOptions({ mapping, onUpdate }) {
  const { transforms } = mapping;

  const updateTransform = (key, value) => {
    onUpdate({
      transforms: { ...transforms, [key]: value }
    });
  };

  return (
    <div className="px-4 pb-3 ml-8">
      <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Default Value</label>
          <input
            type="text"
            value={transforms.defaultValue}
            onChange={(e) => updateTransform('defaultValue', e.target.value)}
            placeholder="Fallback if empty"
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Type Cast</label>
          <select
            value={transforms.typeCast}
            onChange={(e) => updateTransform('typeCast', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="date">Date (ISO)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Prefix</label>
          <input
            type="text"
            value={transforms.prefix}
            onChange={(e) => updateTransform('prefix', e.target.value)}
            placeholder="e.g. $, #"
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Suffix</label>
          <input
            type="text"
            value={transforms.suffix}
            onChange={(e) => updateTransform('suffix', e.target.value)}
            placeholder="e.g. %, USD"
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
    </div>
  );
}
