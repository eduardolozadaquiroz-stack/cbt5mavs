"use client";

interface SavedToastProps {
  visible: boolean;
  message?: string;
  type?: "success" | "error";
}

export default function SavedToast({
  visible,
  message = "✅ Cambios guardados exitosamente",
  type = "success",
}: SavedToastProps) {
  if (!visible) return null;

  const bg =
    type === "error"
      ? "bg-red-600 shadow-red-900/30"
      : "bg-green-600 shadow-green-900/30";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-xl ${bg} text-white shadow-xl text-sm font-semibold pointer-events-none`}
    >
      {type === "success" ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      )}
      {message}
    </div>
  );
}
