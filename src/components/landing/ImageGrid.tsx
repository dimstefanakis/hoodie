export function ImageGrid() {
  return (
    <section className="py-0 px-0 bg-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-zinc-900">
        <div className="relative aspect-[4/5] md:aspect-square bg-black overflow-hidden group border-r border-zinc-900">
           <img 
             src="/images/texture.png" 
             alt="Fabric Texture Detail"
             className="object-cover w-full h-full grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105 opacity-80"
           />
           <div className="absolute bottom-8 left-8">
             <span className="text-white text-xs font-bold tracking-widest uppercase border border-white/30 px-3 py-1 backdrop-blur-sm">
               High Density Faux-Fur
             </span>
           </div>
        </div>
        <div className="relative aspect-[4/5] md:aspect-square bg-black overflow-hidden group flex items-center justify-center p-12">
           <img 
             src="/images/cloak.png" 
             alt="The Cloak Silhouette"
             className="object-contain w-full h-full grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-[0_35px_35px_rgba(255,255,255,0.05)] opacity-90"
           />
           <div className="absolute bottom-8 left-8">
             <span className="text-white text-xs font-bold tracking-widest uppercase border border-white/30 px-3 py-1 backdrop-blur-sm">
               Engineered Drape
             </span>
           </div>
        </div>
      </div>
    </section>
  )
}
