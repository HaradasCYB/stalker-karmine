export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 animate-pulse">
      {/* Hero skeleton */}
      <div className="py-16 text-center space-y-4">
        <div className="h-4 w-32 bg-kc-border rounded-full mx-auto" />
        <div className="h-16 w-80 bg-kc-border rounded-xl mx-auto" />
        <div className="h-4 w-64 bg-kc-border rounded-full mx-auto" />
        <div className="flex justify-center gap-3 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 bg-kc-card rounded-xl border border-kc-border" />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-xl p-6 border border-kc-border space-y-3">
            <div className="h-3 w-20 bg-kc-border rounded-full" />
            <div className="h-10 w-16 bg-kc-border rounded-lg mx-auto" />
            <div className="h-2 bg-kc-border rounded-full" />
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass rounded-xl p-4 border border-kc-border space-y-3">
            <div className="flex justify-between">
              <div className="h-3 w-24 bg-kc-border rounded-full" />
              <div className="h-3 w-12 bg-kc-border rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-kc-border rounded-lg" />
              <div className="h-3 flex-1 bg-kc-border rounded-full" />
              <div className="h-6 w-16 bg-kc-border rounded-lg" />
              <div className="h-3 flex-1 bg-kc-border rounded-full" />
              <div className="w-8 h-8 bg-kc-border rounded-lg" />
            </div>
            <div className="h-px bg-kc-border" />
            <div className="flex justify-between">
              <div className="h-2 w-20 bg-kc-border rounded-full" />
              <div className="h-2 w-12 bg-kc-border rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
