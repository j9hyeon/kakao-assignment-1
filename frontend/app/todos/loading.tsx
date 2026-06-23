export default function TodosLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#ede9f6" }}>
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg">
        <div className="h-9 w-32 rounded-full mx-auto mb-6 animate-pulse" style={{ backgroundColor: "#ede9f6" }} />
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 w-5 rounded animate-pulse" style={{ backgroundColor: "#ede9f6" }} />
          <div className="h-4 w-44 rounded animate-pulse" style={{ backgroundColor: "#ede9f6" }} />
          <div className="h-5 w-5 rounded animate-pulse" style={{ backgroundColor: "#ede9f6" }} />
        </div>
        <div className="grid grid-cols-7 gap-1 mb-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ backgroundColor: "#ede9f6" }} />
          ))}
        </div>
        <div className="h-10 rounded-full mb-4 animate-pulse" style={{ backgroundColor: "#ede9f6" }} />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 h-10 rounded-full animate-pulse" style={{ backgroundColor: "#ede9f6" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
