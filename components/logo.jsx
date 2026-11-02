// Marca: dos cuadrados superpuestos (uno menta) y el nombre
export function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-block size-6">
        <span className="absolute left-0 top-0 size-4 rounded-[3px] border-2 border-current" />
        <span className="absolute bottom-0 right-0 size-4 rounded-[3px] bg-mint" />
      </span>
      <span className="text-lg font-medium tracking-tight">MesaTech Cloud</span>
    </div>
  );
}
