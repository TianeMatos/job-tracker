export default function KanbanIllustration() {
  const cols = [
    { accent: "#c9a227", bars: ["#c9a227dd", "#c9a227bb", "#c9a22799"], opacity: 1 },
    { accent: "#a07c1a", bars: ["#a07c1acc", "#a07c1a99", "#a07c1a66"], opacity: 0.8 },
    { accent: "#6b5512", bars: ["#6b5512aa", "#6b551277", "#6b551244"], opacity: 0.5 },
  ];
  return (
    <div className="flex items-start gap-2.5 py-1">
      {cols.map((col, i) => (
        <div
          key={i}
          className="flex flex-col gap-1.5 rounded-lg p-2.5 flex-1"
          style={{ border: `1px solid ${col.accent}55`, backgroundColor: `${col.accent}08`, opacity: col.opacity }}
        >
          <div className="h-1 rounded-full w-6 mb-1" style={{ backgroundColor: col.accent }} />
          {col.bars.map((bar, j) => (
            <div key={j} className="rounded p-1.5 flex flex-col gap-1" style={{ backgroundColor: `${col.accent}10` }}>
              <div className="h-1 rounded-full w-full" style={{ backgroundColor: bar }} />
              <div className="h-1 rounded-full" style={{ backgroundColor: bar, width: j === 1 ? "55%" : "75%" }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}