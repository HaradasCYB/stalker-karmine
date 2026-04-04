export default function GameLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 animate-pulse">
      <div className="py-12 text-center space-y-3 mb-10">
        <div className="h-3 w-24 bg-kc-border rounded-full mx-auto" />
        <div className="h-14 w-60 bg-kc-border rounded-xl mx-auto" />
        <div className="h-1 w-20 bg-kc-border rounded-full mx-auto" />
      </div>
      <div className="glass rounded-xl p-4 border border-kc-border flex gap-6 mb-10">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 text-center space-y-1">
            <div className="h-8 w-12 bg-kc-border rounded-lg mx-auto" />
            <div className="h-2 w-16 bg-kc-border rounded-full mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 border border-kc-border space-y-3">
            <div className="h-3 w-32 bg-kc-border rounded-full" />
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 bg-kc-border rounded-lg" />
              <div className="h-3 flex-1 bg-kc-border rounded-full" />
              <div className="h-6 w-14 bg-kc-border rounded-lg" />
              <div className="h-3 flex-1 bg-kc-border rounded-full" />
              <div className="w-8 h-8 bg-kc-border rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
