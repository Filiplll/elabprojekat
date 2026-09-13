export default function TereniSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between h-52"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="h-6 bg-slate-200 rounded-md w-2/3"></div>
              <div className="h-5 bg-slate-200 rounded-full w-16"></div>
            </div>
            <div className="h-4 bg-slate-100 rounded-md w-1/3"></div>
            <div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="h-6 bg-slate-200 rounded-md w-24"></div>
            <div className="h-9 bg-slate-200 rounded-xl w-28"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
