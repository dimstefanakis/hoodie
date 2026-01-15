import { Shield, VolumeX, Feather } from "lucide-react"

export function Features() {
  const features = [
    {
      title: "Pitch Black Exterior",
      description: "Dense faux fur that absorbs light and creates a visual void.",
      icon: VolumeX,
    },
    {
      title: "Velvet Interior",
      description: "Proprietary soft-touch lining for immediate warmth and hidden comfort.",
      icon: Feather,
    },
    {
      title: "Oversized Drape",
      description: "Structured to flow, not just hang. A silhouette that commands attention.",
      icon: Shield,
    },
  ]

  return (
    <section className="py-32 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          {features.map((feature, index) => (
            <div key={index} className="space-y-6 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 transition-colors group-hover:border-white/50">
                <feature.icon className="w-6 h-6 stroke-1 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-light tracking-tight">{feature.title}</h3>
              <p className="text-zinc-500 font-light leading-relaxed max-w-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
