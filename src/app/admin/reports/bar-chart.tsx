export default function BarChart({
  data,
  max,
  color,
}: {
  data: { label: string; value: number }[];
  max: number;
  color: string;
}) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="text-xs text-stone-500 w-14 text-right">
            {item.label}
          </span>
          <div className="flex-1 bg-stone-100 rounded-full h-6 overflow-hidden">
            <div
              className={`h-full rounded-full ${color} transition-all flex items-center justify-end pr-2`}
              style={{ width: `${(item.value / max) * 100}%` }}
            >
              <span className="text-xs text-white font-medium">
                {item.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
