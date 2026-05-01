export default function AvisosPagination() {
  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-2">
        <button
          className="p-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant disabled:opacity-50 transition-colors"
          disabled
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button className="w-10 h-10 border border-primary bg-primary text-on-primary rounded font-label-bold text-label-bold flex items-center justify-center">
          1
        </button>
        <button className="w-10 h-10 border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant rounded font-label-bold text-label-bold flex items-center justify-center transition-colors">
          2
        </button>
        <button className="w-10 h-10 border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant rounded font-label-bold text-label-bold flex items-center justify-center transition-colors">
          3
        </button>
        <span className="text-on-surface-variant px-2">...</span>
        <button className="p-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
