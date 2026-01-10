"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const sizeOptions = [
  { id: "size-sm", value: "S/M" },
  { id: "size-lg", value: "L/XL" },
]

interface SizeSelectorProps {
  value: string | null
  onChange: (value: string) => void
  isInvalid?: boolean
}

export function SizeSelector({ value, onChange, isInvalid }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Fit
        </span>
        <span className="text-xs text-zinc-500">Oversized by design.</span>
      </div>
      <RadioGroup
        value={value ?? undefined}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-3"
      >
        {sizeOptions.map((option) => (
          <div key={option.id} className="relative">
            <RadioGroupItem
              id={option.id}
              value={option.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={option.id}
              className={cn(
                "flex h-12 w-full cursor-pointer items-center justify-center border border-zinc-800 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400 transition-colors",
                "hover:border-zinc-500",
                "peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-black",
                isInvalid && !value
                  ? "border-red-500/70 text-red-400/90 hover:border-red-400"
                  : null,
              )}
            >
              {option.value}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
