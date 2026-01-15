export function Footer() {
  return (
    <footer className="py-24 px-6 border-t border-zinc-900 bg-black text-center text-white">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-8">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase opacity-80">The Eclipse Cloak</p>
        <div className="w-px h-12 bg-gradient-to-b from-zinc-800 to-transparent"></div>
        <p className="text-[10px] text-zinc-600 font-light tracking-widest uppercase">
          © {new Date().getFullYear()} All rights reserved. <br />
          Designed for absolute disconnect.
        </p>
      </div>
    </footer>
  )
}